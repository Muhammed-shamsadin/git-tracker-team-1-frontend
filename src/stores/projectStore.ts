import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import {
    Project,
    ProjectDetail,
    CreateProjectData,
    UpdateProjectData,
    AssignDeveloperData,
    RemoveDeveloperData,
} from "@/types/Project";

interface PaginatedProjects {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ProjectState {
    projects: Project[];
    paginatedProjects: PaginatedProjects | null;
    currentProject: ProjectDetail | null;
    isLoading: boolean;
    error: string | null;
    message: string | null;

    // Core project operations
    fetchAllProjects: (page?: number, limit?: number) => Promise<void>;
    fetchProjectById: (id: string) => Promise<void>;
    createProject: (data: CreateProjectData) => Promise<Project | undefined>;
    updateProject: (
        id: string,
        data: UpdateProjectData
    ) => Promise<Project | undefined>;
    deleteProject: (id: string) => Promise<boolean>;

    // Developer assignment operations
    assignDevelopers: (data: AssignDeveloperData) => Promise<any>;
    removeDeveloper: (data: RemoveDeveloperData) => Promise<boolean>;

    // Role-based project fetching (from user endpoints)
    fetchClientProjects: () => Promise<void>; // users/clients/me/projects
    fetchDeveloperProjects: () => Promise<void>; // users/developers/me/projects
    fetchProjectsByClientId: (clientId: string) => Promise<void>; // projects/client/:clientId

    // Project sub-resources
    fetchProjectRepositories: (projectId: string) => Promise<any[]>;
    fetchDeveloperRepositoriesForProject: (
        projectId: string,
        developerId: string
    ) => Promise<any>;

    // Utilities
    clearCurrentProject: () => void;
    clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            paginatedProjects: null,
            currentProject: null,
            isLoading: false,
            error: null,
            message: null,

            // GET /api/projects?page=1&limit=10
            fetchAllProjects: async (page = 1, limit = 10) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects?page=${page}&limit=${limit}`
                    );
                    // Backend returns array directly, not paginated for this endpoint
                    const projects = response.data.data || response.data;

                    set({
                        projects: Array.isArray(projects) ? projects : [],
                        paginatedProjects: {
                            projects: Array.isArray(projects) ? projects : [],
                            total: Array.isArray(projects)
                                ? projects.length
                                : 0,
                            page,
                            limit,
                            totalPages: Math.ceil(
                                (Array.isArray(projects)
                                    ? projects.length
                                    : 0) / limit
                            ),
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch projects",
                        isLoading: false,
                    });
                }
            },

            // GET /api/projects/:id
            fetchProjectById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    if (!id) {
                        set({
                            error: "Project ID is required",
                            isLoading: false,
                        });
                        return;
                    }
                    const response = await api.get(`/projects/${id}`);
                    set({
                        currentProject: response.data.data || response.data,
                        message: response.data.data?.message,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch project",
                        isLoading: false,
                    });
                }
            },

            // POST /api/projects
            createProject: async (data: CreateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post("/projects", data);
                    const newProject = response.data.data || response.data;

                    if (newProject && newProject._id) {
                        set((state) => ({
                            projects: [...state.projects, newProject],
                            isLoading: false,
                        }));
                        return newProject;
                    } else {
                        set({ isLoading: false });
                        return undefined;
                    }
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to create project",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // PATCH /api/projects/:id
            updateProject: async (id: string, data: UpdateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/projects/${id}`, data);
                    const updatedProject = response.data.data || response.data;

                    set((state) => ({
                        projects: state.projects.map((p) =>
                            p._id === id ? updatedProject : p
                        ),
                        currentProject:
                            state.currentProject?._id === id
                                ? { ...state.currentProject, ...updatedProject }
                                : state.currentProject,
                        isLoading: false,
                    }));
                    return updatedProject;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to update project",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // DELETE /api/projects/:id
            deleteProject: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.delete(`/projects/${id}`);
                    const result = response.data.data || response.data;

                    if (result.deleted) {
                        set((state) => ({
                            projects: state.projects.filter(
                                (p) => p._id !== id
                            ),
                            currentProject:
                                state.currentProject?._id === id
                                    ? null
                                    : state.currentProject,
                            isLoading: false,
                        }));
                        return true;
                    }
                    set({ isLoading: false });
                    return false;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to delete project",
                        isLoading: false,
                    });
                    return false;
                }
            },

            // PATCH /api/projects/assign-developer
            assignDevelopers: async (data: AssignDeveloperData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(
                        "/projects/assign-developer",
                        data
                    );
                    const result = response.data.data || response.data;

                    set({
                        isLoading: false,
                        message: result.message,
                    });

                    // Refresh current project if it's the one being updated
                    const currentProject = get().currentProject;
                    if (
                        currentProject &&
                        currentProject._id === data.projectId
                    ) {
                        get().fetchProjectById(data.projectId);
                    }

                    return result;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to assign developers",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // PATCH /api/projects/remove-developer
            removeDeveloper: async (data: RemoveDeveloperData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(
                        "/projects/remove-developer",
                        data
                    );
                    const result = response.data.data || response.data;

                    if (result.removedDeveloper) {
                        set({ isLoading: false });

                        // Refresh current project if it's the one being updated
                        const currentProject = get().currentProject;
                        if (
                            currentProject &&
                            currentProject._id === data.projectId
                        ) {
                            get().fetchProjectById(data.projectId);
                        }
                        return true;
                    }
                    set({ isLoading: false });
                    return false;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to remove developer",
                        isLoading: false,
                    });
                    return false;
                }
            },

            // GET /api/users/clients/me/projects
            fetchClientProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        "/users/clients/me/projects"
                    );
                    set({
                        projects: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch client projects",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/developers/me/projects
            fetchDeveloperProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        "/users/developers/me/projects"
                    );
                    set({
                        projects: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch developer projects",
                        isLoading: false,
                    });
                }
            },

            // GET /api/projects/client/:clientId
            fetchProjectsByClientId: async (clientId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects/client/${clientId}`
                    );
                    set({
                        projects: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch projects by client",
                        isLoading: false,
                    });
                }
            },

            // GET /api/projects/:projectId/repositories
            fetchProjectRepositories: async (projectId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects/${projectId}/repositories`
                    );
                    set({ isLoading: false });
                    return response.data.data || response.data;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch repositories",
                        isLoading: false,
                    });
                    return [];
                }
            },

            // GET /api/projects/:projectId/developers/:developerId/repositories
            fetchDeveloperRepositoriesForProject: async (
                projectId: string,
                developerId: string
            ) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects/${projectId}/developers/${developerId}/repositories`
                    );
                    set({ isLoading: false });
                    return response.data.data || response.data;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch developer repositories",
                        isLoading: false,
                    });
                    return { repositories: [], total: 0 };
                }
            },

            clearCurrentProject: () => {
                set({ currentProject: null, message: null });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "project-storage",
            partialize: (state) => ({
                projects: state.projects,
                currentProject: state.currentProject,
            }),
        }
    )
);
