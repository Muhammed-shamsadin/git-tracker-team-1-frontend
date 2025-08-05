import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

interface PaginatedUsers {
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UserState {
    users: any[];
    paginatedUsers: PaginatedUsers | null;
    currentUser: any | null;
    clients: any[];
    developers: any[];
    isLoading: boolean;
    error: string | null;
    fetchAllUsers: (
        page?: number,
        limit?: number,
        role?: string
    ) => Promise<void>;
    fetchClients: () => Promise<void>;
    fetchDevelopers: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    createUser: (data: any) => Promise<any | undefined>;
    updateUser: (id: string, data: any) => Promise<any | undefined>;
    updateMe: (data: any) => Promise<any | undefined>;
    fetchProfile: () => Promise<void>;
    fetchDeveloperProjects: () => Promise<void>;
    fetchDeveloperRepositories: () => Promise<void>;
    fetchClientProjects: () => Promise<void>;
    clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            users: [],
            paginatedUsers: null,
            currentUser: null,
            clients: [],
            developers: [],
            isLoading: false,
            error: null,

            fetchAllUsers: async (page = 1, limit = 10, role?: string) => {
                set({ isLoading: true, error: null });
                try {
                    let url = `/users?page=${page}&limit=${limit}`;
                    if (role) url += `&role=${role}`;
                    const response = await api.get(url);
                    const data = response.data.data;
                    set({
                        users: data.users,
                        paginatedUsers: {
                            users: data.users,
                            total: data.total,
                            page: data.page,
                            limit: data.limit,
                            totalPages: data.totalPages,
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch users",
                        isLoading: false,
                    });
                }
            },

            fetchClients: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/users/clients");
                    set({ clients: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch clients",
                        isLoading: false,
                    });
                }
            },

            fetchDevelopers: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/users/developers");
                    set({ developers: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch developers",
                        isLoading: false,
                    });
                }
            },

            fetchUserById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/${id}`);
                    set({ currentUser: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch user",
                        isLoading: false,
                    });
                }
            },

            createUser: async (data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post("/users/create", data);
                    set({ isLoading: false });
                    return response.data.data;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to create user",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            updateUser: async (id: string, data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/users/${id}`, data);
                    set({ currentUser: response.data.data, isLoading: false });
                    return response.data.data;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update user",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            updateMe: async (data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/users/update-me`, data);
                    set({ currentUser: response.data.data, isLoading: false });
                    return response.data.data;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to update profile",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/profile`);
                    set({ currentUser: response.data.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch profile",
                        isLoading: false,
                    });
                }
            },

            fetchDeveloperProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/developers/me/projects`
                    );
                    set({
                        currentUser: {
                            ...get().currentUser,
                            projects: response.data.data,
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch developer projects",
                        isLoading: false,
                    });
                }
            },

            fetchDeveloperRepositories: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/developers/me/repositories`
                    );
                    set({
                        currentUser: {
                            ...get().currentUser,
                            repositories: response.data.data,
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.message ||
                            "Failed to fetch developer repositories",
                        isLoading: false,
                    });
                }
            },

            fetchClientProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/clients/me/projects`
                    );
                    set({
                        currentUser: {
                            ...get().currentUser,
                            projects: response.data.data,
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.message || "Failed to fetch client projects",
                        isLoading: false,
                    });
                }
            },

            clearCurrentUser: () => {
                set({ currentUser: null });
            },
        }),
        {
            name: "user-storage",
            partialize: (state) => ({
                users: state.users,
                currentUser: state.currentUser,
            }),
        }
    )
);
