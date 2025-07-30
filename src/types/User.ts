import { z } from "zod";

export const UserSchema = z.object({
    _id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    userType: z.enum(["client", "developer", "superadmin"]),
    profileImage: z.string().nullable(),
    bio: z.string().nullable(),
    lastLogin: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
