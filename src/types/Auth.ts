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
    success: z.boolean(),
    data: z.object({
        access_token: z.string(),
        refresh_token: z.string(),
        user: UserSchema,
    }),
});

// Register request
export const RegisterSchema = z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(1, "Full name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userType: z.enum(["client", "developer", "superadmin"]),
});

// Register response
export const RegisterResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        message: z.string(),
        user: UserSchema,
    }),
});

// Refresh token response
export const RefreshResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        access_token: z.string(),
    }),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
