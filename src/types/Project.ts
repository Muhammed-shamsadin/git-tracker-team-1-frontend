import { z } from "zod";

export const ProjectSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "archived", "completed"]),
    tags: z.array(z.string()).optional(),
    repoLimit: z.number().optional(),
    clientId: z.string(),
    projectDevelopers: z
        .array(
            z.object({
                _id: z.string(),
                developerId: z.string(),
                role: z.string(),
                isActive: z.boolean(),
            })
        )
        .optional(),
    repositories: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Create project schema matching backend CreateProjectDto
export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(), // Backend allows optional description
    status: z.enum(["active", "archived", "completed"]).optional(), // Backend defaults to "active"
    tags: z.array(z.string()).optional(), // Backend allows tags
    repoLimit: z.number().int().positive().optional(), // Backend defaults to 10
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;

// Backend uses different structure for assigning developers
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

// Response types for better type safety
export const ProjectDetailSchema = ProjectSchema.extend({
    repositories: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            registeredBy: z.object({
                _id: z.string(),
                name: z.string(),
                email: z.string(),
            }),
            url: z.string().url().optional(),
            description: z.string().optional(),
            commits: z.number().default(0),
            contributors: z.string().optional(),
            status: z.string(),
            registeredAt: z.string(),
            lastUpdated: z.string(),
        })
    ),
    commitsCount: z.number(),
    members: z.array(
        z.object({
            user_id: z.string(),
            avatar: z.string().optional(),
            location: z.string().optional(),
            last_active: z.string().optional(),
            commits: z.number().optional(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            joined_at: z.string(),
        })
    ),
    message: z.string().optional(),
    id: z.string().optional(), // For compatibility with frontend
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
