// TODO: Uncomment and update the analytics store implementation when the API is ready

// import { create } from "zustand";
// import api from "@/lib/axios";

// interface AnalyticsData {
//     projectActivity: {
//         labels: string[];
//         datasets: Array<{
//             label: string;
//             data: number[];
//             borderColor: string;
//             backgroundColor: string;
//         }>;
//     };
//     commitTrends: {
//         labels: string[];
//         datasets: Array<{
//             label: string;
//             data: number[];
//             borderColor: string;
//             backgroundColor: string;
//         }>;
//     };
//     topContributors: Array<{
//         id: string;
//         name: string;
//         commits: number;
//         additions: number;
//         deletions: number;
//         projects: number;
//     }>;
//     topProjects: Array<{
//         id: string;
//         name: string;
//         commits: number;
//         contributors: number;
//         repositories: number;
//         lastActivity: string;
//     }>;
// }

// interface DateRange {
//     startDate: string;
//     endDate: string;
// }

// interface AnalyticsState {
//     analyticsData: AnalyticsData | null;
//     isLoading: boolean;
//     error: string | null;
//     dateRange: DateRange;

//     // Fetch operations
//     fetchProjectAnalytics: (dateRange?: DateRange) => Promise<void>;
//     fetchRepositoryAnalytics: (dateRange?: DateRange) => Promise<void>;
//     fetchTopContributors: (dateRange?: DateRange) => Promise<void>;
//     fetchTopProjects: (dateRange?: DateRange) => Promise<void>;
//     fetchDashboardAnalytics: (dateRange?: DateRange) => Promise<void>;

//     // Project specific analytics
//     fetchProjectCommitTrends: (
//         projectId: string,
//         dateRange?: DateRange
//     ) => Promise<any>;
//     fetchProjectContributorActivity: (
//         projectId: string,
//         dateRange?: DateRange
//     ) => Promise<any>;

//     // Repository specific analytics
//     fetchRepositoryCommitHistory: (
//         repositoryId: string,
//         dateRange?: DateRange
//     ) => Promise<any>;
//     fetchRepositoryLanguageStats: (repositoryId: string) => Promise<any>;

//     // Utilities
//     setDateRange: (range: DateRange) => void;
//     clearAnalytics: () => void;
// }

// export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
//     analyticsData: null,
//     isLoading: false,
//     error: null,
//     dateRange: {
//         startDate: new Date(
//             Date.now() - 30 * 24 * 60 * 60 * 1000
//         ).toISOString(), // Last 30 days
//         endDate: new Date().toISOString(),
//     },

//     fetchProjectAnalytics: async (dateRange?: DateRange) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/analytics/projects`, {
//                 params: {
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                 },
//             });

//             set((state) => ({
//                 analyticsData: {
//                     ...state.analyticsData,
//                     projectActivity: response.data.data || response.data,
//                 },
//                 isLoading: false,
//             }));
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch project analytics",
//                 isLoading: false,
//             });
//         }
//     },

//     fetchRepositoryAnalytics: async (dateRange?: DateRange) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/analytics/repositories`, {
//                 params: {
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                 },
//             });

//             set((state) => ({
//                 analyticsData: {
//                     ...state.analyticsData,
//                     commitTrends: response.data.data || response.data,
//                 },
//                 isLoading: false,
//             }));
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch repository analytics",
//                 isLoading: false,
//             });
//         }
//     },

//     fetchTopContributors: async (dateRange?: DateRange) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/analytics/top-contributors`, {
//                 params: {
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                 },
//             });

//             set((state) => ({
//                 analyticsData: {
//                     ...state.analyticsData,
//                     topContributors: response.data.data || response.data,
//                 },
//                 isLoading: false,
//             }));
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch top contributors",
//                 isLoading: false,
//             });
//         }
//     },

//     fetchTopProjects: async (dateRange?: DateRange) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/analytics/top-projects`, {
//                 params: {
//                     startDate: range.startDate,
//                     endDate: range.endDate,
//                 },
//             });

//             set((state) => ({
//                 analyticsData: {
//                     ...state.analyticsData,
//                     topProjects: response.data.data || response.data,
//                 },
//                 isLoading: false,
//             }));
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch top projects",
//                 isLoading: false,
//             });
//         }
//     },

//     fetchDashboardAnalytics: async (dateRange?: DateRange) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;

//             // Fetch all analytics in parallel
//             const [
//                 projectsRes,
//                 repositoriesRes,
//                 contributorsRes,
//                 topProjectsRes,
//             ] = await Promise.all([
//                 api.get(`/analytics/projects`, { params: range }),
//                 api.get(`/analytics/repositories`, { params: range }),
//                 api.get(`/analytics/top-contributors`, { params: range }),
//                 api.get(`/analytics/top-projects`, { params: range }),
//             ]);

//             set({
//                 analyticsData: {
//                     projectActivity: projectsRes.data.data || projectsRes.data,
//                     commitTrends:
//                         repositoriesRes.data.data || repositoriesRes.data,
//                     topContributors:
//                         contributorsRes.data.data || contributorsRes.data,
//                     topProjects:
//                         topProjectsRes.data.data || topProjectsRes.data,
//                 },
//                 isLoading: false,
//             });
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch dashboard analytics",
//                 isLoading: false,
//             });
//         }
//     },

//     fetchProjectCommitTrends: async (
//         projectId: string,
//         dateRange?: DateRange
//     ) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/projects/${projectId}/analytics`, {
//                 params: range,
//             });
//             set({ isLoading: false });
//             return response.data.data || response.data;
//         } catch (error: any) {
//             set({
//                 error: error.message || "Failed to fetch project commit trends",
//                 isLoading: false,
//             });
//             return null;
//         }
//     },

//     fetchProjectContributorActivity: async (
//         projectId: string,
//         dateRange?: DateRange
//     ) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(`/projects/${projectId}/commits`, {
//                 params: range,
//             });
//             set({ isLoading: false });
//             return response.data.data || response.data;
//         } catch (error: any) {
//             set({
//                 error:
//                     error.message ||
//                     "Failed to fetch project contributor activity",
//                 isLoading: false,
//             });
//             return null;
//         }
//     },

//     fetchRepositoryCommitHistory: async (
//         repositoryId: string,
//         dateRange?: DateRange
//     ) => {
//         set({ isLoading: true, error: null });
//         try {
//             const range = dateRange || get().dateRange;
//             const response = await api.get(
//                 `/repositories/${repositoryId}/analytics`,
//                 {
//                     params: range,
//                 }
//             );
//             set({ isLoading: false });
//             return response.data.data || response.data;
//         } catch (error: any) {
//             set({
//                 error:
//                     error.message ||
//                     "Failed to fetch repository commit history",
//                 isLoading: false,
//             });
//             return null;
//         }
//     },

//     fetchRepositoryLanguageStats: async (repositoryId: string) => {
//         set({ isLoading: true, error: null });
//         try {
//             const response = await api.get(
//                 `/repositories/${repositoryId}/language-stats`
//             );
//             set({ isLoading: false });
//             return response.data.data || response.data;
//         } catch (error: any) {
//             set({
//                 error:
//                     error.message ||
//                     "Failed to fetch repository language stats",
//                 isLoading: false,
//             });
//             return null;
//         }
//     },

//     setDateRange: (range: DateRange) => {
//         set({ dateRange: range });
//     },

//     clearAnalytics: () => {
//         set({ analyticsData: null, error: null });
//     },
// }));
