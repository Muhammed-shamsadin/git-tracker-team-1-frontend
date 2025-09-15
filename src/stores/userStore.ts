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
    fetchedUser: any | null;
    developerDetails: any | null;
    clients: any[];
    developers: any[];
    isLoading: boolean;
    error: string | null;

    // Core user operations
    fetchAllUsers: (
        page?: number,
        limit?: number,
        role?: string
    ) => Promise<void>;
    fetchClients: () => Promise<void>;
    fetchDevelopers: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    fetchDevDetail: (id: string) => Promise<void>;
    createUser: (data: any) => Promise<any | undefined>;
    updateUser: (id: string, data: any) => Promise<any | undefined>;
    updateMe: (data: any) => Promise<any | undefined>;
    fetchProfile: () => Promise<void>;

    // Utilities
    clearCurrentUser: () => void;
    clearError: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            users: [],
            paginatedUsers: null,
            currentUser: null,
            fetchedUser: null,
            developerDetails: null,
            clients: [],
            developers: [],
            isLoading: false,
            error: null,

            // GET /api/users?page=1&limit=10&role=CLIENT
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
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch users",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/clients
            fetchClients: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/users/clients");
                    set({
                        clients: response.data.data.users || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch clients",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/developers
            fetchDevelopers: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/users/developers");
                    set({
                        developers: response.data.data.users || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch developers",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/:id
            fetchUserById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/${id}`);
                    const userData = response.data.data.user || response.data;
                    set({
                        fetchedUser: userData,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch user",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/:id?withDetails=true
            fetchDevDetail: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/${id}?withDetails=true`
                    );
                    const detailData = response.data.data;
                    set({
                        developerDetails: detailData,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch developer details",
                        isLoading: false,
                    });
                }
            },

            // POST /api/users/create
            createUser: async (data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post("/users/create", data);
                    const newUser = response.data.data || response.data;

                    set((state) => ({
                        users: [...state.users, newUser],
                        isLoading: false,
                    }));
                    return newUser;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to create user",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // PATCH /api/users/update/:id
            updateUser: async (id: string, data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(
                        `/users/update/${id}`,
                        data
                    );
                    const updatedUser = response.data.data || response.data;

                    set((state) => ({
                        users: state.users.map((u) =>
                            u._id === id ? updatedUser : u
                        ),
                        currentUser:
                            state.currentUser?._id === id
                                ? updatedUser
                                : state.currentUser,
                        isLoading: false,
                    }));
                    return updatedUser;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to update user",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // PATCH /api/users/update-me
            updateMe: async (data: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch("/users/update-me", data);
                    const updatedUser = response.data.data || response.data;

                    set({
                        currentUser: updatedUser,
                        isLoading: false,
                    });
                    return updatedUser;
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to update profile",
                        isLoading: false,
                    });
                    return undefined;
                }
            },

            // GET /api/users/profile
            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get("/users/profile");
                    set({
                        currentUser: response.data.data || response.data,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch profile",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/developers/me/repositories
            fetchDeveloperRepositories: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        "/users/developers/me/repositories"
                    );
                    set({
                        currentUser: {
                            ...get().currentUser,
                            repositories: response.data.data || response.data,
                        },
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error:
                            error.response?.data?.message ||
                            error.message ||
                            "Failed to fetch developer repositories",
                        isLoading: false,
                    });
                }
            },

            // GET /api/users/developers/:developerId/repositories
            fetchSpecificDeveloperRepositories: async (developerId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(
                        `/users/developers/${developerId}/repositories`
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
                    return [];
                }
            },

            clearCurrentUser: () => {
                set({ currentUser: null });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "user-storage",
            partialize: (state) => ({
                users: state.users,
                currentUser: state.currentUser,
                fetchedUser: state.fetchedUser,
                developerDetails: state.developerDetails,
                clients: state.clients,
                developers: state.developers,
            }),
        }
    )
);
