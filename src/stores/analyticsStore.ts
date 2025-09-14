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
	
	// Actions
	fetchKPIData: () => Promise<void>;
	fetchProjects: () => Promise<void>;
	fetchRepositories: (projectId?: string) => Promise<void>;
	fetchProjectAnalytics: (projectId: string, timeRange?: TimeRange) => Promise<void>;
	fetchRepositoryAnalytics: (repositoryId: string, timeRange?: TimeRange) => Promise<void>;
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
}));


