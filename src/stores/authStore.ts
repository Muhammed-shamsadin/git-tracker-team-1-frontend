import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { User, UserSchema } from "@/types/User";
import {
    LoginData,
    RegisterData,
    LoginResponse,
    LoginResponseSchema,
    RegisterResponse,
    RegisterResponseSchema,
    RefreshResponseSchema,
} from "@/types/Auth";
import {
    setAuthTokenCookie,
    removeAuthTokenCookie,
} from "@/stores/cookieUtils";

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,

            login: async (data: LoginData) => {
                set({ isLoading: true });
                try {
                    const response = await api.post("/auth/login", data);
                    const parsed = LoginResponseSchema.parse(response.data);
                    const { access_token, refresh_token, user } = parsed.data;

                    localStorage.setItem("auth-token", access_token);
                    localStorage.setItem("refresh-token", refresh_token);
                    setAuthTokenCookie(access_token);

                    set({
                        user,
                        token: access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            register: async (data: RegisterData) => {
                set({ isLoading: true });
                try {
                    const response = await api.post("/auth/register", data);
                    const parsed = RegisterResponseSchema.parse(response.data);
                    const user = parsed.data.user;

                    // Registration does not return tokens, so require login after registration
                    // TODO: Consider auto-login after registration if desired or just redirect to login
                    set({
                        user,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem("auth-token");
                localStorage.removeItem("refresh-token");
                removeAuthTokenCookie();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            checkAuth: async () => {
                const token = localStorage.getItem("auth-token");
                if (!token) {
                    set({ isAuthenticated: false });
                    return;
                }

                try {
                    const response = await api.get("/users/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const user = UserSchema.parse(response.data.data);
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error("Error checking auth:", error);
                }
            },

            refreshToken: async () => {
                const refreshToken = localStorage.getItem("refresh-token");
                console.log(`Refreshing token with: ${refreshToken}`);
                if (!refreshToken) throw new Error("No refresh token");

                const response = await api.post("/auth/refresh", {
                    refreshToken,
                });
                console.log("Refresh response:", response);
                const parsed = RefreshResponseSchema.parse(response.data);
                console.log("Parsed refresh response:", parsed);
                const { access_token } = parsed.data;
                console.log(`New access token: ${access_token}`);
                localStorage.setItem("auth-token", access_token);
                setAuthTokenCookie(access_token);
                set({ token: access_token });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
