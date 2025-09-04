import { z } from "zod";
import { UserSchema } from "./User";

// Login request
export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().optional(),
});

// Login response
export const LoginResponseSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    message: z.string(),
    user: UserSchema,
});

// Register request
export const RegisterSchema = z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(1, "Full name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userType: z.enum(["client", "developer"]),
});

// Register response
export const RegisterResponseSchema = z.object({
    user: UserSchema,
    message: z.string(),
});

// Refresh token request
export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string(),
});

// Refresh token response
export const RefreshResponseSchema = z.object({
    access_token: z.string(),
    message: z.string(),
});

// Check token request
export const CheckTokenRequestSchema = z.object({
    token: z.string(),
});

// Check token response
export const CheckTokenResponseSchema = z.object({
    expired: z.boolean(),
    remainingTime: z.number(),
    expirationDate: z.string(),
    message: z.string(),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
export type CheckTokenRequest = z.infer<typeof CheckTokenRequestSchema>;
export type CheckTokenResponse = z.infer<typeof CheckTokenResponseSchema>;
