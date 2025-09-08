import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface CommitData {
    _id: string;
    repoId:
        | string
        | {
              _id: string;
              name: string;
          };
    developerId:
        | string
        | {
              _id: string;
              email: string;
              fullName: string;
          };
    projectId:
        | string
        | {
              _id: string;
              name: string;
          };
    commitHash: string;
    message: string;
    branch: string;
    timestamp: string;
    stats: {
        files_changed: number;
        files_added: number;
        files_removed: number;
        lines_added: number;
        lines_removed: number;
    };
    changes: Array<{
        fileName: string;
        added: number;
        removed: number;
    }>;
    parentCommit: string;
    desktopSyncedAt: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface GitDataResponse {
    commits: CommitData[];
    totalCommits: number;
    page: string;
    limit: string;
    totalPages: number;
    message: string;
}

interface GitDataState {
    commits: CommitData[];
    currentCommits: GitDataResponse | null;
    memberCommits: CommitData[];
    memberCommitsForDisplay: CommitData[];
    memberStatsData: {
        totalCommits: number;
        totalLinesAdded: number;
        totalLinesRemoved: number;
        uniqueRepositories: number;
    } | null;
    isLoading: boolean;
    error: string | null;

    // Git data operations
    fetchCommits: (params: {
        page?: number;
        limit?: number;
        branch?: string;
        repoId?: string;
        developerId?: string;
        projectId?: string;
    }) => Promise<GitDataResponse | undefined>;

    fetchMemberCommits: (params: {
        developerId: string;
        projectId: string;
        page?: number;
        limit?: number;
        branch?: string;
        repoId?: string;
    }) => Promise<void>;

    // New optimized functions for member details
    fetchMemberStats: (params: {
        developerId: string;
        projectId: string;
        branch?: string;
    }) => Promise<void>;

    fetchMemberRecentCommits: (params: {
        developerId: string;
        projectId: string;
        limit?: number;
        branch?: string;
    }) => Promise<void>;

    // Fetch single commit by ID
    fetchCommitById: (commitId: string) => Promise<CommitData | undefined>;

    // Utilities
    clearCommits: () => void;
    clearMemberCommits: () => void;
    clearError: () => void;
}

export const useGitDataStore = create<GitDataState>()(
    persist(
        (set, get) => ({
            commits: [],
            currentCommits: null,
            memberCommits: [],
            memberCommitsForDisplay: [],
            memberStatsData: null,
            isLoading: false,
            error: null,

            // GET /api/git-data/?page=1&limit=5&branch=main&repoId={{repo_id}}&developerId={{dev_id}}&projectID={{project_id}}
            fetchCommits: async (params) => {
                set({ isLoading: true, error: null });
                try {
                    const searchParams = new URLSearchParams();

                    if (params.page)
                        searchParams.append("page", params.page.toString());
                    if (params.limit)
                        searchParams.append("limit", params.limit.toString());
                    if (params.branch)
                        searchParams.append("branch", params.branch);
                    if (params.repoId)
                        searchParams.append("repoId", params.repoId);
                    if (params.developerId)
                        searchParams.append("developerId", params.developerId);
                    if (params.projectId)
                        searchParams.append("projectID", params.projectId);

                    const response = await api.get(
                        `/git-data/?${searchParams.toString()}`
                    );
                    const data = response.data.data;

                    set({
                        commits: data.commits,
                        currentCommits: data,
                        isLoading: false,
                    });

                    return data;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch git data",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // Fetch commits specifically for a member in a project
            fetchMemberCommits: async (params) => {
                set({ isLoading: true, error: null });
                try {
                    const searchParams = new URLSearchParams();

                    searchParams.append("developerId", params.developerId);
                    searchParams.append("projectID", params.projectId);
                    searchParams.append("page", (params.page || 1).toString());
                    searchParams.append(
                        "limit",
                        (params.limit || 1000).toString()
                    );

                    if (params.branch)
                        searchParams.append("branch", params.branch);
                    if (params.repoId)
                        searchParams.append("repoId", params.repoId);

                    const response = await api.get(
                        `/git-data/?${searchParams.toString()}`
                    );
                    const data = response.data.data;

                    set({
                        memberCommits: data.commits,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch member commits",
                        isLoading: false,
                    });
                }
            },

            // Optimized function to fetch member stats (high limit for accurate calculations)
            fetchMemberStats: async (params) => {
                set({ isLoading: true, error: null });
                try {
                    const searchParams = new URLSearchParams();

                    searchParams.append("developerId", params.developerId);
                    searchParams.append("projectID", params.projectId);
                    searchParams.append("page", "1");
                    searchParams.append("limit", "10000"); // High limit for stats

                    if (params.branch)
                        searchParams.append("branch", params.branch);

                    const response = await api.get(
                        `/git-data/?${searchParams.toString()}`
                    );
                    const data = response.data.data;

                    // Calculate stats from all commits
                    const commits: CommitData[] = data.commits || [];
                    const statsData = {
                        totalCommits: commits.length,
                        totalLinesAdded: commits.reduce(
                            (sum: number, commit: CommitData) =>
                                sum + (commit.stats?.lines_added || 0),
                            0
                        ),
                        totalLinesRemoved: commits.reduce(
                            (sum: number, commit: CommitData) =>
                                sum + (commit.stats?.lines_removed || 0),
                            0
                        ),
                        uniqueRepositories: new Set(
                            commits.map((commit: CommitData) =>
                                typeof commit.repoId === "string"
                                    ? commit.repoId
                                    : commit.repoId._id
                            )
                        ).size,
                    };

                    set({
                        memberStatsData: statsData,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch member stats",
                        isLoading: false,
                    });
                }
            },

            // Optimized function to fetch recent commits for display (low limit)
            fetchMemberRecentCommits: async (params) => {
                set({ isLoading: true, error: null });
                try {
                    const searchParams = new URLSearchParams();

                    searchParams.append("developerId", params.developerId);
                    searchParams.append("projectID", params.projectId);
                    searchParams.append("page", "1");
                    searchParams.append(
                        "limit",
                        (params.limit || 10).toString()
                    ); // Low limit for display

                    if (params.branch)
                        searchParams.append("branch", params.branch);

                    const response = await api.get(
                        `/git-data/?${searchParams.toString()}`
                    );
                    const data = response.data.data;

                    set({
                        memberCommitsForDisplay: data.commits || [],
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch recent member commits",
                        isLoading: false,
                    });
                }
            },

            // Fetch single commit by ID using the new API endpoint
            fetchCommitById: async (commitId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/git-data/${commitId}`);
                    const data = response.data.data;

                    set({ isLoading: false });
                    return data.commit;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch commit details",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            clearCommits: () => {
                set({ commits: [], currentCommits: null });
            },

            clearMemberCommits: () => {
                set({
                    memberCommits: [],
                    memberCommitsForDisplay: [],
                    memberStatsData: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "git-data-storage",
            partialize: (state: GitDataState) => ({
                commits: state.commits,
                memberCommits: state.memberCommits,
            }),
        }
    )
);
