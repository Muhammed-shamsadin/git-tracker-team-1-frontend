import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import {
    Project,
    ProjectSchema,
    CreateProjectData,
    UpdateProjectData,
    AssignRemoveDevelopersData,
} from "@/types/Project";
import { useAuthStore } from "./authStore";

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
    currentProject: Project | null;
    isLoading: boolean;
    error: string | null;
    fetchAllProjects: (page?: number, limit?: number) => Promise<void>;
    fetchClientsProjects: () => Promise<void>;
    fetchProjectById: (id: string) => Promise<void>;
    createProject: (data: CreateProjectData) => Promise<Project | undefined>;
    updateProject: (
        id: string,
        data: UpdateProjectData
    ) => Promise<Project | undefined>;
    deleteProject: (id: string) => Promise<boolean>;
    assignDeveloper: (data: {
        projectId: string;
        developerId: string;
        role?: string;
    }) => Promise<Project | undefined>;
    removeDeveloper: (data: {
        projectId: string;
        developerId: string;
    }) => Promise<boolean>;
    fetchProjectsByClientId: (clientId: string) => Promise<void>;
    fetchProjectRepositories: (projectId: string) => Promise<any[]>;
    fetchDeveloperRepositoriesForProject: (
        projectId: string,
        developerId: string
    ) => Promise<any[]>;
    fetchDeveloperProjects: () => Promise<void>;
    clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            paginatedProjects: null,
            currentProject: null,
            isLoading: false,
            error: null,

            fetchAllProjects: async (page = 1, limit = 10) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects?page=${page}&limit=${limit}`
                    );
                    let paginated: PaginatedProjects = {
                        projects: [],
                        total: 0,
                        page,
                        limit,
                        totalPages: 1,
                    };
                    if (Array.isArray(response.data)) {
                        paginated.projects = response.data;
                    } else if (response.data.data) {
                        paginated.projects =
                            response.data.data.users ||
                            response.data.data.projects ||
                            response.data.data;
                        paginated.total = response.data.data.total || 0;
                        paginated.page = response.data.data.page || page;
                        paginated.limit = response.data.data.limit || limit;
                        paginated.totalPages =
                            response.data.data.totalPages || 1;
                    }
                    set({
                        projects: paginated.projects,
                        paginatedProjects: paginated,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch projects",
                        isLoading: false,
                    });
                }
            },

            fetchClientsProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/clients/me/projects`
                    );
                    set({ projects: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch client's projects",
                        isLoading: false,
                    });
                }
            },

            fetchProjectById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/projects/${id}`);
                    set({ currentProject: response.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch project",
                        isLoading: false,
                    });
                }
            },

            createProject: async (data: CreateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post("/projects", data);
                    // Extract the actual project object from response
                    const newProject = response.data?.data || response.data;
                    // Only add to state if valid
                    if (
                        newProject &&
                        newProject.name &&
                        (newProject._id || newProject.id)
                    ) {
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
                        error: error.message || "Failed to create project",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            updateProject: async (id: string, data: UpdateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/projects/${id}`, data);
                    const updatedProject = response.data;
                    set((state) => ({
                        projects: state.projects.map((p) =>
                            p._id === id ? updatedProject : p
                        ),
                        currentProject:
                            state.currentProject?._id === id
                                ? updatedProject
                                : state.currentProject,
                        isLoading: false,
                    }));
                    return updatedProject;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update project",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            deleteProject: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.delete(`/projects/${id}`);
                    if (response.data.deleted) {
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
                        error: error.message || "Failed to delete project",
                        isLoading: false,
                    });
                    return false;
                }
            },

            assignDeveloper: async (data: {
                projectId: string;
                developerId: string;
                role?: string;
            }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(
                        `/projects/assign-developer`,
                        data
                    );
                    const updatedProject = response.data;
                    set((state) => ({
                        projects: state.projects.map((p) =>
                            p._id === data.projectId ? updatedProject : p
                        ),
                        currentProject:
                            state.currentProject?._id === data.projectId
                                ? updatedProject
                                : state.currentProject,
                        isLoading: false,
                    }));
                    return updatedProject;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to assign developer",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            removeDeveloper: async (data: {
                projectId: string;
                developerId: string;
            }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.delete(
                        `/projects/remove-developer`,
                        { data }
                    );
                    if (response.data.removedDeveloper) {
                        set((state) => ({
                            projects: state.projects.map((p) => {
                                if (p._id === data.projectId) {
                                    return {
                                        ...p,
                                        developers: p.developers?.filter(
                                            (developerId: string) =>
                                                developerId !== data.developerId
                                        ),
                                    };
                                }
                                return p;
                            }),
                            isLoading: false,
                        }));
                        return true;
                    }
                    set({ isLoading: false });
                    return false;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to remove developer",
                        isLoading: false,
                    });
                    return false;
                }
            },

            fetchProjectsByClientId: async (clientId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/projects/client/${clientId}`
                    );
                    set({ projects: response.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch projects by client",
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
                    set({ isLoading: false });
                    return response.data;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch repositories",
                        isLoading: false,
                    });
                    return [];
                }
            },

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
                    return response.data.repositories || [];
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch developer repositories",
                        isLoading: false,
                    });
                    return [];
                }
            },

            fetchDeveloperProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/developers/me/projects`
                    );
                    set({ projects: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch developer projects",
                        isLoading: false,
                    });
                }
            },
            clearCurrentProject: () => {
                set({ currentProject: null });
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
