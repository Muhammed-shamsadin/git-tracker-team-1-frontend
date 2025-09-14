import { z } from "zod";

export const UserProfileSchema = z.object({
    bio: z.string().nullable(),
    location: z.string().nullable(),
    socialLinks: z.array(z.string()),
    skills: z.array(z.string()),
});

export const UserSchema = z.object({
    _id: z.string(),
    id: z.string().optional(),
    email: z.string().email(),
    fullName: z.string(),
    userType: z.enum(["client", "developer", "superadmin"]),
    profileImage: z.string().nullable(),
    companyName: z.string().optional(),
    workspaces: z.array(z.string()).optional(),
    registeredRepos: z.array(z.string()).optional(),
    lastLogin: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    isActive: z.boolean().optional(),
    userName: z.string().optional(),
    profile: UserProfileSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;

// User creation schema (for admin use)
export const CreateUserSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userType: z.enum(["client", "developer", "superadmin"]),
    companyName: z.string().optional(),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;

// User profile update schema
export const UpdateUserProfileSchema = z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    profileImage: z.string().optional(),
    profile: z
        .object({
            bio: z.string().optional(),
            location: z.string().optional(),
            socialLinks: z.array(z.string()).optional(),
            skills: z.array(z.string()).optional(),
        })
        .optional(),
});

export type UpdateUserProfileData = z.infer<typeof UpdateUserProfileSchema>;

// User creation response
export const CreateUserResponseSchema = z.object({
    user: UserSchema,
    message: z.string(),
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

// User profile response
export const UserProfileResponseSchema = z.object({
    user: UserSchema,
    message: z.string(),
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

// User list response (with pagination)
export const UserListResponseSchema = z.object({
    users: z.array(UserSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    message: z.string(),
});

export type UserListResponse = z.infer<typeof UserListResponseSchema>;

// User list response (simple - for clients/developers endpoints)
export const SimpleUserListResponseSchema = z.object({
    users: z.array(UserSchema),
    message: z.string(),
});

export type SimpleUserListResponse = z.infer<
    typeof SimpleUserListResponseSchema
>;

// Delete user response
export const DeleteUserResponseSchema = z.object({
    deleted: z.boolean(),
    id: z.string(),
});

export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;
