import { create } from "zustand";
import api from "@/lib/axios";

type KPIData = {
	totalProjects: number;
	activeProjects: number;
	totalRepositories: number;
	totalCommits: number;
	averageCommitsPerProject: number;
} | null;

type CommitData = {
	date: string;
	commits: number;
}[];

type Contributor = {
	user_id: string;
	name: string;
	email: string;
	commits: number;
};

type Project = {
	id: string;
	name: string;
};

type Repository = {
	id: string;
	name: string;
	projectId?: string;
};

type TimeRange = "week" | "month" | "year";

type EffortSlice = {
	projectId: string;
	projectName: string;
	commits: number;
	percentage: number; // 0-100
};

interface AnalyticsState {
	kpiData: KPIData;
	isLoading: boolean;
	error: string | null;
	
	// Project and repository data
	projects: Project[];
	repositories: Repository[];
	selectedProjectId: string | null;
	selectedRepositoryId: string | null;
	
	// Analytics data
	projectCommitData: CommitData | null;
	repositoryCommitData: CommitData | null;
	projectContributors: Contributor[] | null;
	repositoryContributors: Contributor[] | null;
	effortDistribution: EffortSlice[] | null;
	topContributors: Contributor[] | null;
	generalStats: {
		totalProjects: number;
		activeProjects: number;
		totalDevelopers: number;
		totalCommits: number;
	} | null;
	
	// Actions
	fetchKPIData: () => Promise<void>;
	fetchProjects: () => Promise<void>;
	fetchRepositories: (projectId?: string) => Promise<void>;
	fetchProjectAnalytics: (projectId: string, timeRange?: TimeRange) => Promise<void>;
	fetchRepositoryAnalytics: (repositoryId: string, timeRange?: TimeRange) => Promise<void>;
	// TODO: Re-enable when backend endpoint is finalized
	// fetchEffortDistribution: () => Promise<void>;
    fetchGeneralAnalytics: () => Promise<void>;
	setSelectedProject: (projectId: string | null) => void;
	setSelectedRepository: (repositoryId: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
	kpiData: null,
	isLoading: false,
	error: null,
	
	// Project and repository data
	projects: [],
	repositories: [],
	selectedProjectId: null,
	selectedRepositoryId: null,
	
	// Analytics data
	projectCommitData: null,
	repositoryCommitData: null,
	projectContributors: null,
	repositoryContributors: null,
	effortDistribution: null,
	topContributors: null,
	generalStats: null,

	// Fetch the KPI data required by the analytics page
	fetchKPIData: async () => {
		set({ isLoading: true, error: null });
		try {
			// Fetch projects, repositories and git-data in parallel
			const [projectsRes, repositoriesRes, gitDataRes] = await Promise.all([
				api.get("/projects"),
				api.get("/repositories"),
				api.get("/git-data"),
			]);

			// Flexible response parsing (backend sometimes wraps in data.data)
			const projectsPayload = projectsRes.data?.data ?? projectsRes.data;
			const repositoriesPayload = repositoriesRes.data?.data ?? repositoriesRes.data;
			const gitPayload = gitDataRes.data?.data ?? gitDataRes.data;

			const projects = Array.isArray(projectsPayload)
				? projectsPayload
				: projectsPayload?.projects ?? [];

			const repositories = Array.isArray(repositoriesPayload)
				? repositoriesPayload
				: repositoriesPayload?.repositories ?? [];

			const totalProjects = projects.length;

			// Active projects: if backend provides status field, count; otherwise try filter by status
			const activeProjects = projects.filter((p: any) => {
				return (
					p?.status === "active" || p?.isActive === true || p?.status === "ongoing"
				);
			}).length || 0;

			const totalRepositories = Array.isArray(repositories)
				? repositories.length
				: 0;

			// gitPayload may be an object with totalCommits
			const totalCommits = typeof gitPayload === "object" && gitPayload !== null
				? Number(gitPayload.totalCommits ?? gitPayload.total_commits ?? 0)
				: 0;

			const averageCommitsPerProject = totalProjects > 0
				? Math.round(totalCommits / totalProjects)
				: 0;

			set({
				kpiData: {
					totalProjects,
					activeProjects,
					totalRepositories,
					totalCommits,
					averageCommitsPerProject,
				},
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load KPI data",
				isLoading: false,
			});
		}
	},

	// Fetch all projects for dropdown
	fetchProjects: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get("/projects");
			const projectsPayload = response.data?.data ?? response.data;
			const projects = Array.isArray(projectsPayload)
				? projectsPayload
				: projectsPayload?.projects ?? [];
			
			set({
				projects: projects.map((p: any) => ({
					id: p.id,
					name: p.name || p.title || `Project ${p.id}`,
				})),
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load projects",
				isLoading: false,
			});
		}
	},

	// Fetch repositories (optionally filtered by project)
	fetchRepositories: async (projectId?: string) => {
		set({ isLoading: true, error: null });
		try {
			let response;
			if (projectId) {
				response = await api.get(`/projects/${projectId}/repositories`);
			} else {
				response = await api.get("/repositories");
			}
			
			const repositoriesPayload = response.data?.data ?? response.data;
			const repositories = Array.isArray(repositoriesPayload)
				? repositoriesPayload
				: repositoriesPayload?.repositories ?? [];
			
			set({
				repositories: repositories.map((r: any) => ({
					id: r.id,
					name: r.name || r.title || `Repository ${r.id}`,
					projectId: r.projectId || projectId,
				})),
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load repositories",
				isLoading: false,
			});
		}
	},

	// Fetch project analytics data (supports time range)
	fetchProjectAnalytics: async (projectId: string, timeRange?: TimeRange) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get(`/projects/${projectId}/analytics`, {
				// Support multiple param names in case backend expects a different key
				params: timeRange
					? { timeRange, range: timeRange, time_range: timeRange }
					: undefined,
			});
			const payload = response.data?.data ?? response.data;
			console.log("Project Analytics Data:", payload);
			
			// Normalize commit graph shape
			const rawGraph = payload?.commit_graph || payload?.commits || [];
			const commitData: CommitData = Array.isArray(rawGraph)
				? rawGraph
					.map((d: any) => ({
						date: typeof d.date === "string" ? d.date : new Date(d.date).toISOString().slice(0, 10),
						commits: Number(d.commits ?? d.count ?? 0),
					}))
					.filter((d: any) => d && d.date && !Number.isNaN(d.commits))
				: [];
			const contributors: Contributor[] = payload?.top_contributors || [];
			
			set({
				projectCommitData: commitData,
				projectContributors: contributors,
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load project analytics",
				isLoading: false,
			});
		}
	},

	// Fetch repository analytics data
	fetchRepositoryAnalytics: async (repositoryId: string, timeRange?: TimeRange) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get(`/repositories/${repositoryId}/analytics`, {
				// Support multiple param names in case backend expects a different key
				params: timeRange
					? { timeRange, range: timeRange, time_range: timeRange }
					: undefined,
			});
			const payload = response.data?.data ?? response.data;
			console.log("Repository Analytics Data:", payload, "(range:", timeRange, ")");
			
			// Normalize commit graph shape
			const rawGraph = payload?.commit_graph || payload?.commits || [];
			const commitData: CommitData = Array.isArray(rawGraph)
				? rawGraph
					.map((d: any) => ({
						date: typeof d.date === "string" ? d.date : new Date(d.date).toISOString().slice(0, 10),
						commits: Number(d.commits ?? d.count ?? 0),
					}))
					.filter((d: any) => d && d.date && !Number.isNaN(d.commits))
				: [];
			const contributors: Contributor[] = payload?.top_contributors || [];
			
			set({
				repositoryCommitData: commitData,
				repositoryContributors: contributors,
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load repository analytics",
				isLoading: false,
			});
		}
	},

	// Effort distribution across projects
	// fetchEffortDistribution: async () => {
	//     set({ isLoading: true, error: null });
	//     try {
	//         const response = await api.get(`/analytics/effort-distribution`);
	//         const payload = response.data?.data ?? response.data;
	//         const raw: any[] = Array.isArray(payload) ? payload : payload?.items ?? [];
	//         const totalCommits = raw.reduce((acc, r) => acc + Number(r.commits ?? 0), 0);
	//         const slices: EffortSlice[] = raw.map((r) => ({
	//             projectId: r.projectId ?? r.project_id ?? r.id,
	//             projectName: r.projectName ?? r.name ?? `Project ${r.projectId ?? r.id}`,
	//             commits: Number(r.commits ?? 0),
	//             percentage: typeof r.percentage === "number" && !Number.isNaN(r.percentage)
	//                 ? r.percentage
	//                 : totalCommits > 0
	//                     ? (Number(r.commits ?? 0) / totalCommits) * 100
	//                     : 0,
	//         }));
	//         set({ effortDistribution: slices, isLoading: false });
	//     } catch (error: any) {
	//         set({
	//             error: error?.response?.data?.message || error?.message || "Failed to load effort distribution",
	//             isLoading: false,
	//         });
	//     }
	// },

	// Set selected project and fetch its repositories
	setSelectedProject: (projectId: string | null) => {
		set({ selectedProjectId: projectId, selectedRepositoryId: null });
		if (projectId) {
			get().fetchRepositories(projectId);
		} else {
			set({ repositories: [] });
		}
	},

	// Set selected repository
	setSelectedRepository: (repositoryId: string | null) => {
		set({ selectedRepositoryId: repositoryId });
	},

	// Load general analytics for dashboard charts (top contributors and project breakdown)
	fetchGeneralAnalytics: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get(`/analytics/general`);
			const payload = response.data?.data ?? response.data;
			// Debug: inspect the full response in the browser console
			console.log("/analytics/general payload:", payload);

			// Normalize top contributors (limit max 5)
			const rawContribs: any[] = Array.isArray(payload?.topContributors)
				? payload.topContributors
				: [];
			const topContributors: Contributor[] = rawContribs
				.slice(0, 5)
				.map((c: any) => {
					const nmRaw =
						c.name ??
						c.fullName ??
						c.full_name ??
						c.username ??
						c.user?.name ??
						c.user?.fullName ??
						[c.user?.firstName, c.user?.lastName].filter(Boolean).join(" ") ??
						[c.firstName, c.lastName].filter(Boolean).join(" ");
					const nm = typeof nmRaw === "string" ? nmRaw.trim() : "";
					const email = c.email ?? c.user?.email ?? "";
					const fallbackFromEmail = typeof email === "string" ? email.split("@")[0] : "";
					return {
						user_id: String(c.user_id ?? c.id ?? ""),
						name: nm || fallbackFromEmail || "Unknown",
						email: email,
						commits: Number(c.commits ?? c.count ?? 0),
					} as Contributor;
				});
			console.log("TopContributors raw:", rawContribs);
			console.log("TopContributors normalized:", topContributors);

			// Normalize project breakdown -> effortDistribution
			const rawBreakdown: any[] = Array.isArray(payload?.projectBreakdown)
				? payload.projectBreakdown
				: [];
			console.log("ProjectBreakdown raw:", rawBreakdown);
			const totalCommits = rawBreakdown.reduce((acc, r) => acc + Number(r.commits ?? 0), 0);
			const effortDistribution: EffortSlice[] = rawBreakdown.map((r) => ({
				projectId: String(r.projectId ?? r.project_id ?? r.id ?? ""),
				projectName: r.projectName ?? r.name ?? `Project ${r.projectId ?? r.id}`,
				commits: Number(r.commits ?? 0),
				percentage: typeof r.percentage === "number" && !Number.isNaN(r.percentage)
					? r.percentage
					: totalCommits > 0
						? (Number(r.commits ?? 0) / totalCommits) * 100
						: 0,
			}));

			set({
				topContributors,
				effortDistribution,
				generalStats: {
					totalProjects: Number(payload?.totalProjects ?? 0),
					activeProjects: Number(payload?.activeProjects ?? 0),
					totalDevelopers: Number(payload?.totalDevelopers ?? 0),
					totalCommits: Number(payload?.totalCommits ?? 0),
				},
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.response?.data?.message || error?.message || "Failed to load general analytics",
				isLoading: false,
			});
		}
	},
}));


