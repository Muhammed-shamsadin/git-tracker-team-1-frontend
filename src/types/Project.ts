import { z } from "zod";

// Basic project schema for general use
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

// Project creation request schema
export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    status: z.enum(["active", "archived", "completed"]).optional(),
    tags: z.array(z.string()).optional(),
    repoLimit: z.number().int().positive().optional(),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;

// Project creation response schema
export const ProjectCreationResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    owner_id: z.string(),
    description: z.string(),
    status: z.string(),
    tags: z.array(z.string()),
    repo_limit: z.number(),
    repositories: z.array(z.any()),
    created_at: z.string(),
    updated_at: z.string(),
    members: z.array(
        z.object({
            user_id: z.string(),
            role: z.string(),
            joined_at: z.string(),
        })
    ),
    message: z.string(),
});

export type ProjectCreationResponse = z.infer<
    typeof ProjectCreationResponseSchema
>;

// Project list item schema (for paginated lists)
export const ProjectListItemSchema = z.object({
    _id: z.string(),
    name: z.string(),
    status: z.string(),
    tags: z.array(z.string()),
    membersCount: z.number(),
    commitsCount: z.number(),
    lastUpdated: z.string(),
});

export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;

// Project list response schema (paginated)
export const ProjectListResponseSchema = z.object({
    projects: z.array(ProjectListItemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    message: z.string(),
});

export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;

// Project update schema
export const UpdateProjectSchema = CreateProjectSchema.partial();
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;

// Developer assignment schema
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

// Developer assignment response
export const AssignDeveloperResponseSchema = z.object({
    developers: z.array(z.string()),
    assigned: z.number(),
    skipped: z.number(),
    message: z.string(),
});

export type AssignDeveloperResponse = z.infer<
    typeof AssignDeveloperResponseSchema
>;

// Remove developer schema
export const RemoveDeveloperSchema = z.object({
    projectId: z.string(),
    developerId: z.string(),
});

export type RemoveDeveloperData = z.infer<typeof RemoveDeveloperSchema>;

// Remove developer response
export const RemoveDeveloperResponseSchema = z.object({
    removedDeveloper: z.boolean(),
    developerId: z.string(),
    projectId: z.string(),
});

export type RemoveDeveloperResponse = z.infer<
    typeof RemoveDeveloperResponseSchema
>;

// Project detail schema (full project info)
export const ProjectDetailSchema = z.object({
    _id: z.string(),
    name: z.string(),
    clientId: z.string(),
    description: z.string(),
    status: z.string(),
    tags: z.array(z.string()),
    repoLimit: z.number(),
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
    createdAt: z.string(),
    updatedAt: z.string(),
    members: z.array(
        z.object({
            userId: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            joinedAt: z.string(),
        })
    ),
    message: z.string(),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;

// Project delete response
export const ProjectDeleteResponseSchema = z.object({
    deleted: z.boolean(),
    deletedProjectId: z.string(),
});

export type ProjectDeleteResponse = z.infer<typeof ProjectDeleteResponseSchema>;

// Project analytics schema
export const ProjectAnalyticsSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        commit_graph: z.array(
            z.object({
                date: z.string(),
                commits: z.number(),
            })
        ),
        top_contributors: z.array(
            z.object({
                user_id: z.string(),
                name: z.string(),
                email: z.string(),
                commits: z.number(),
            })
        ),
        total_commits: z.number(),
        active_contributors: z.number(),
        project_id: z.string(),
    }),
});

export type ProjectAnalytics = z.infer<typeof ProjectAnalyticsSchema>;

// Project members response
export const ProjectMembersResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(
        z.object({
            user_id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            joined_at: z.string(),
        })
    ),
    totalMembers: z.number(),
});

export type ProjectMembersResponse = z.infer<
    typeof ProjectMembersResponseSchema
>;

// Client/Developer specific project list (for users endpoints)
export const UserProjectListResponseSchema = z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: z.array(ProjectListItemSchema).optional(),
    totalProjects: z.number().optional(),
});

export type UserProjectListResponse = z.infer<
    typeof UserProjectListResponseSchema
>;

// Simple project list (array response for some endpoints)
export const SimpleProjectListSchema = z.array(ProjectListItemSchema);
export type SimpleProjectList = z.infer<typeof SimpleProjectListSchema>;
