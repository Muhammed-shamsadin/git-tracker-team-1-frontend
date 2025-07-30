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
import { z } from "zod";

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    isLoading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    fetchProjectById: (id: string) => Promise<void>;
    createProject: (data: CreateProjectData) => Promise<Project | undefined>;
    updateProject: (
        id: string,
        data: UpdateProjectData
    ) => Promise<Project | undefined>;
    deleteProject: (id: string) => Promise<void>;
    assignOrRemoveDevelopers: (
        id: string,
        data: AssignRemoveDevelopersData
    ) => Promise<Project | undefined>;
    clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            currentProject: null,
            isLoading: false,
            error: null,

            fetchProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/projects");
                    const projects = z
                        .array(ProjectSchema)
                        .parse(response.data.data);
                    set({ projects, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch projects",
                        isLoading: false,
                    });
                }
            },

            fetchProjectById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/projects/${id}`);
                    const project = ProjectSchema.parse(response.data.data);
                    set({ currentProject: project, isLoading: false });
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
                    const newProject = ProjectSchema.parse(response.data.data);
                    set((state) => ({
                        projects: [...state.projects, newProject],
                        isLoading: false,
                    }));
                    return newProject;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to create project",
                        isLoading: false,
                    });
                }
            },

            updateProject: async (id: string, data: UpdateProjectData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/projects/${id}`, data);
                    const updatedProject = ProjectSchema.parse(
                        response.data.data
                    );
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
                }
            },

            deleteProject: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/projects/${id}`);
                    set((state) => ({
                        projects: state.projects.filter((p) => p._id !== id),
                        currentProject:
                            state.currentProject?._id === id
                                ? null
                                : state.currentProject,
                        isLoading: false,
                    }));
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to delete project",
                        isLoading: false,
                    });
                }
            },

            assignOrRemoveDevelopers: async (
                id: string,
                data: AssignRemoveDevelopersData
            ) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(
                        `/projects/${id}/developers`,
                        data
                    );
                    const updatedProject = ProjectSchema.parse(
                        response.data.data
                    );
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
                        error: error.message || "Failed to update developers",
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
