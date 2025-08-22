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
    lastLogin: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    isActive: z.boolean().optional(),
    userName: z.string().optional(),
    profile: UserProfileSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;
