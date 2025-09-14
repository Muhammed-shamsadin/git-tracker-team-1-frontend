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
    RefreshResponse,
    RefreshResponseSchema,
    RefreshTokenRequest,
    CheckTokenRequest,
    CheckTokenResponse,
    CheckTokenResponseSchema,
} from "@/types/Auth";
import { UserProfileResponse, UserProfileResponseSchema } from "@/types/User";
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
    checkTokenExpiry: (token: string) => Promise<CheckTokenResponse>;
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
                    const raw = response.data.data
                        ? response.data.data
                        : response.data;
                    const parsed = LoginResponseSchema.parse(raw);
                    const { access_token, refresh_token, user } = parsed;

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
                    const parsed = RegisterResponseSchema.parse(
                        response.data.data
                    );

                    const { user } = parsed;

                    // Registration does not return tokens, so require login after registration
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
                    const response = await api.get("/users/profile");
                    const parsed = UserProfileResponseSchema.parse(
                        response.data.data
                    );

                    const { user } = parsed;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error("Error checking auth:", error);
                    // If profile check fails, clear authentication
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    });
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("refresh-token");
                    removeAuthTokenCookie();
                }
            },

            refreshToken: async () => {
                const refreshTokenValue = localStorage.getItem("refresh-token");
                if (!refreshTokenValue) throw new Error("No refresh token");

                try {
                    const response = await api.post("/auth/refresh", {
                        refreshToken: refreshTokenValue,
                    });
                    const parsed = RefreshResponseSchema.parse(
                        response.data.data
                    );
                    const { access_token } = parsed;

                    localStorage.setItem("auth-token", access_token);
                    setAuthTokenCookie(access_token);
                    set({ token: access_token });
                } catch (error) {
                    // If refresh fails, logout user
                    get().logout();
                    throw error;
                }
            },

            checkTokenExpiry: async (token: string) => {
                const response = await api.post("/auth/check-token", { token });
                return CheckTokenResponseSchema.parse(response.data.data);
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
