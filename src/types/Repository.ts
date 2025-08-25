import { z } from "zod";

export const RepositorySchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    status: z.enum(["active", "archived", "deleted"]),
    projectId: z.string(),
    ownerId: z.string(), // Developer who owns the repository
    contributors: z.array(z.string()), // Array of developer IDs
    lastCommitAt: z.string().nullable(),
    commitsCount: z.number().default(0),
    branchCount: z.number().default(0),
    tags: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Repository = z.infer<typeof RepositorySchema>;

export const CreateRepositorySchema = z.object({
    name: z.string().min(1, "Repository name is required"),
    description: z.string().min(1, "Description is required"),
    url: z.string().url("Invalid repository URL"),
    projectId: z.string().min(1, "Project ID is required"),
    status: z.enum(["active", "archived"]).default("active"),
});

export type CreateRepositoryData = z.infer<typeof CreateRepositorySchema>;

export const UpdateRepositorySchema = CreateRepositorySchema.partial().omit({
    projectId: true,
});

export type UpdateRepositoryData = z.infer<typeof UpdateRepositorySchema>;

// Commit related schemas
export const CommitSchema = z.object({
    _id: z.string(),
    sha: z.string(),
    message: z.string(),
    authorId: z.string(),
    authorName: z.string(),
    authorEmail: z.string(),
    repositoryId: z.string(),
    projectId: z.string(),
    timestamp: z.string(),
    stats: z.object({
        additions: z.number(),
        deletions: z.number(),
        changes: z.array(
            z.object({
                filename: z.string(),
                additions: z.number(),
                deletions: z.number(),
                status: z.enum(["added", "modified", "deleted", "renamed"]),
            })
        ),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Commit = z.infer<typeof CommitSchema>;

// Analytics schemas
export const RepositoryAnalyticsSchema = z.object({
    totalCommits: z.number(),
    totalContributors: z.number(),
    commitsByDay: z.array(
        z.object({
            date: z.string(),
            count: z.number(),
        })
    ),
    topContributors: z.array(
        z.object({
            developerId: z.string(),
            name: z.string(),
            commits: z.number(),
            additions: z.number(),
            deletions: z.number(),
        })
    ),
    languageStats: z.array(
        z.object({
            language: z.string(),
            percentage: z.number(),
            lines: z.number(),
        })
    ),
});

export type RepositoryAnalytics = z.infer<typeof RepositoryAnalyticsSchema>;
