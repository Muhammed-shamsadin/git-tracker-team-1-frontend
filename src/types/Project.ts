import { optional, z } from "zod";

export const ProjectSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "inactive"]),
    repoLimit: z.number().optional(),
    clientId: z.string(),
    developers: z.array(z.string()),
    repositories: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["active", "inactive"]),
    repoLimit: z
        .number()
        .int()
        .positive("Repository limit must be a positive number")
        .optional(),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;

export const AssignRemoveDevelopersSchema = z.object({
    developerIds: z.array(z.string()),
    action: z.enum(["assign", "remove"]),
});

export type AssignRemoveDevelopersData = z.infer<
    typeof AssignRemoveDevelopersSchema
>;
