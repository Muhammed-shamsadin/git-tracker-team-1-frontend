import { z } from "zod";

export const ProjectSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "archived", "completed"]).or(z.string()),
    tags: z.array(z.string()).optional(),
    repoLimit: z.number().optional(),
    clientId: z.string(),
    repositories: z.array(z.any()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    status: z.enum(["active", "archived", "completed"]).optional(),
    tags: z.array(z.string()).optional(),
    repoLimit: z.number().int().positive().optional(),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;

export const AssignDeveloperSchema = z.object({
    projectId: z.string(),
    developers: z.array(z.string()), // Array of developer IDs
    role: z
        .enum([
            "frontend",
            "backend",
            "fullstack",
            "qa",
            "devops",
            "designer",
            "developer",
        ])
        .optional(),
});

export type AssignDeveloperData = z.infer<typeof AssignDeveloperSchema>;

export const RemoveDeveloperSchema = z.object({
    projectId: z.string(),
    developerId: z.string(),
});

export type RemoveDeveloperData = z.infer<typeof RemoveDeveloperSchema>;

export const ProjectDetailSchema = ProjectSchema.extend({
    repositories: z.array(
        z.object({
            _id: z.string(),
            name: z.string(),
            registeredBy: z.object({
                _id: z.string(),
                name: z.string(),
                email: z.string(),
            }),
            status: z.string(),
            registeredAt: z.string(),
            lastUpdated: z.string(),
        })
    ),
    commitsCount: z.number(),
    members: z.array(
        z.object({
            userId: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            joinedAt: z.string(),
        })
    ),
    message: z.string().optional(),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
