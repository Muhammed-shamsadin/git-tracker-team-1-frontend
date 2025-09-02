import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import {
    Repository,
    CreateRepositoryData,
    UpdateRepositoryData,
} from "@/types/Repository";

interface PaginatedRepositories {
    repositories: Repository[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface RepositoryState {
    repositories: Repository[];
    paginatedRepositories: PaginatedRepositories | null;
    currentRepository: Repository | null;
    isLoading: boolean;
    error: string | null;

    // Fetch operations
    fetchAllRepositories: (page?: number, limit?: number) => Promise<void>;
    fetchDeveloperRepositories: () => Promise<void>;
    fetchProjectRepositories: (projectId: string) => Promise<void>;
    fetchRepositoryById: (id: string) => Promise<void>;

    // CRUD operations
    createRepository: (
        data: CreateRepositoryData
    ) => Promise<Repository | undefined>;
    updateRepository: (
        id: string,
        data: UpdateRepositoryData
    ) => Promise<Repository | undefined>;
    deleteRepository: (id: string) => Promise<boolean>;

    // Repository specific operations
    fetchRepositoryCommits: (
        repositoryId: string,
        page?: number,
        limit?: number
    ) => Promise<any[]>;
    fetchRepositoryContributors: (repositoryId: string) => Promise<any[]>;
    fetchRepositoryAnalytics: (repositoryId: string) => Promise<any>;

    // Utilities
    clearCurrentRepository: () => void;
}

export const useRepositoryStore = create<RepositoryState>()(
    persist(
        (set, get) => ({
            repositories: [],
            paginatedRepositories: null,
            currentRepository: null,
            isLoading: false,
            error: null,

            fetchAllRepositories: async (page = 1, limit = 10) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/repositories?page=${page}&limit=${limit}`
                    );
                    const data = response.data.data || response.data;

                    const paginated: PaginatedRepositories = {
                        repositories: data.repositories || data,
                        total: data.total || 0,
                        page: data.page || page,
                        limit: data.limit || limit,
                        totalPages: data.totalPages || 1,
                    };

                    set({
                        repositories: paginated.repositories,
                        paginatedRepositories: paginated,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch repositories",
                        isLoading: false,
                    });
                }
            },

            fetchDeveloperRepositories: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        "/repositories/me/developer"
                    );
                    const fetchedRepos =
                        response.data.data.repositories || response.data;
                    console.log(
                        "Fetched developer repositories:",
                        fetchedRepos
                    );
                    set({
                        repositories: fetchedRepos,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch user repositories",
                        isLoading: false,
                    });
                }
            },

            fetchProjectRepositories: async (projectId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects/${projectId}/repositories`
                    );
                    set({
                        repositories: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch project repositories",
                        isLoading: false,
                    });
                }
            },

            fetchRepositoryById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/repositories/${id}`);
                    set({
                        currentRepository: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch repository",
                        isLoading: false,
                    });
                }
            },

            createRepository: async (data: CreateRepositoryData) => {
                set({ isLoading: true, error: null });
                try {
                    // Use new backend endpoint for registration
                    const response = await api.post(
                        "/repositories/register",
                        data
                    );
                    const newRepository = response.data.data || response.data;

                    // Accept either _id or id for new repositories
                    const repoId = newRepository._id || newRepository.id;
                    if (newRepository && repoId) {
                        set((state) => ({
                            repositories: [
                                ...state.repositories,
                                newRepository,
                            ],
                            isLoading: false,
                        }));
                        return newRepository;
                    } else {
                        set({ isLoading: false });
                        return undefined;
                    }
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to create repository",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            updateRepository: async (
                id: string,
                data: UpdateRepositoryData
            ) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(
                        `/repositories/${id}`,
                        data
                    );
                    const updatedRepository =
                        response.data.data || response.data;

                    set((state) => ({
                        repositories: state.repositories.map((r) =>
                            r._id === id ? updatedRepository : r
                        ),
                        currentRepository:
                            state.currentRepository?._id === id
                                ? updatedRepository
                                : state.currentRepository,
                        isLoading: false,
                    }));
                    return updatedRepository;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update repository",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            deleteRepository: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.delete(`/repositories/${id}`);
                    const result = response.data.data || response.data;
                    if (result.deleted || response.status === 200) {
                        set((state) => ({
                            repositories: state.repositories.filter(
                                (r) => r._id !== id
                            ),
                            currentRepository:
                                state.currentRepository?._id === id
                                    ? null
                                    : state.currentRepository,
                            isLoading: false,
                        }));
                        return true;
                    }
                    set({ isLoading: false });
                    return false;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to delete repository",
                        isLoading: false,
                    });
                    return false;
                }
            },

            fetchRepositoryCommits: async (
                repositoryId: string,
                page = 1,
                limit = 10
            ) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/repositories/${repositoryId}/commits?page=${page}&limit=${limit}`
                    );
                    const commits =
                        response.data.data?.commits || response.data;

                    // Map author info from developer data if needed
                    // This would be enhanced with real user data from the API
                    const commitsWithAuthor = commits.map((commit: any) => ({
                        ...commit,
                        author: {
                            name: `Developer ${commit.developerId.substring(
                                0,
                                5
                            )}`,
                            avatar: `/placeholder.svg?id=${commit.developerId}`,
                        },
                    }));

                    set({ isLoading: false });
                    return commitsWithAuthor;
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch repository commits",
                        isLoading: false,
                    });
                    return [];
                }
            },

            fetchRepositoryContributors: async (repositoryId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/repositories/${repositoryId}/contributors`
                    );
                    set({ isLoading: false });
                    return response.data.data || response.data;
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch repository contributors",
                        isLoading: false,
                    });
                    return [];
                }
            },

            fetchRepositoryAnalytics: async (repositoryId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/repositories/${repositoryId}/analytics`
                    );
                    set({ isLoading: false });
                    return response.data.data || response.data;
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch repository analytics",
                        isLoading: false,
                    });
                    return {};
                }
            },

            clearCurrentRepository: () => {
                set({ currentRepository: null });
            },
        }),
        {
            name: "repository-storage",
            partialize: (state) => ({
                repositories: state.repositories,
                currentRepository: state.currentRepository,
            }),
        }
    )
);
