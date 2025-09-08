import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface CommitData {
    _id: string;
    repoId: string;
    developerId: string;
    projectId: string;
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

            clearCommits: () => {
                set({ commits: [], currentCommits: null });
            },

            clearMemberCommits: () => {
                set({ memberCommits: [] });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "git-data-storage",
            partialize: (state) => ({
                commits: state.commits,
                memberCommits: state.memberCommits,
            }),
        }
    )
);
