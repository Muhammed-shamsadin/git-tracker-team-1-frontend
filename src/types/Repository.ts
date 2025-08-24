import { z } from "zod";

// Repository schema
export const RepositorySchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    path: z.string(),
    developerId: z.string(),
    projectId: z.string(),
    permission: z.string().optional(),
    repoFingerprint: z.string(),
    status: z.enum(["active", "moved", "archived", "deleted"]),
    createdAt: z.string(),
    updatedAt: z.string(),
    commits: z.array(z.any()).optional(),
    commitsCount: z.number().optional(), // For summary views
});

export type Repository = z.infer<typeof RepositorySchema>;

// Repository registration schema
export const RegisterRepositorySchema = z.object({
    name: z.string().min(1, "Repository name is required"),
    description: z.string().min(1, "Description is required"),
    path: z.string().min(1, "Repository path is required"),
    developerId: z.string().min(1, "Developer ID is required"),
    projectId: z.string().min(1, "Project ID is required"),
    repoFingerprint: z.string().min(1, "Repository fingerprint is required"),
});

export type RegisterRepositoryData = z.infer<typeof RegisterRepositorySchema>;

// Repository update schema
export const UpdateRepositorySchema = z.object({
    name: z.string().min(1, "Repository name is required").optional(),
    path: z.string().min(1, "Repository path is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    status: z.enum(["active", "moved", "archived"]).optional(),
    developerId: z.string().optional(),
});

export type UpdateRepositoryData = z.infer<typeof UpdateRepositorySchema>;

// Repository with commits (for developer repository endpoint)
export const RepositoryWithCommitsSchema = RepositorySchema.extend({
    commits: z.array(
        z.object({
            _id: z.string(),
            commitHash: z.string(),
            message: z.string(),
            branch: z.string(),
            timestamp: z.string(),
        })
    ),
    commitsCount: z.number(),
});

export type RepositoryWithCommits = z.infer<typeof RepositoryWithCommitsSchema>;

// Developer repositories response
export const DeveloperRepositoriesResponseSchema = z.object({
    repositories: z.array(RepositoryWithCommitsSchema),
    message: z.string(),
});

export type DeveloperRepositoriesResponse = z.infer<
    typeof DeveloperRepositoriesResponseSchema
>;

// Project repositories response (simple array)
export const ProjectRepositoriesResponseSchema = z.array(
    z.object({
        _id: z.string(),
        name: z.string(),
        status: z.string(),
        developerId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
);

export type ProjectRepositoriesResponse = z.infer<
    typeof ProjectRepositoriesResponseSchema
>;

// Developer project repositories response
export const DeveloperProjectRepositoriesResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(RepositorySchema),
    projectId: z.string(),
    developerId: z.string(),
    totalRepositories: z.number(),
});

export type DeveloperProjectRepositoriesResponse = z.infer<
    typeof DeveloperProjectRepositoriesResponseSchema
>;

// Repository analytics schema
export const RepositoryAnalyticsResponseSchema = z.object({
    commit_graph: z.array(
        z.object({
            date: z.string(),
            commits: z.number(),
        })
    ),
    top_contributors: z.array(
        z.object({
            user_id: z.string(),
            commits: z.number(),
        })
    ),
    message: z.string(),
    repository: RepositorySchema,
});

export type RepositoryAnalyticsResponse = z.infer<
    typeof RepositoryAnalyticsResponseSchema
>;

// Simple repository list (for user endpoints)
export const SimpleRepositoryListSchema = z.array(
    z.object({
        _id: z.string(),
        name: z.string(),
        status: z.string(),
        // Can include other fields as needed
    })
);

export type SimpleRepositoryList = z.infer<typeof SimpleRepositoryListSchema>;

// Commit schema (updated to match backend)
export const CommitSchema = z.object({
    _id: z.string(),
    commitHash: z.string(),
    message: z.string(),
    branch: z.string(),
    timestamp: z.string(),
    // Can be extended with more fields as needed
});

export type Commit = z.infer<typeof CommitSchema>;

// Legacy support - keeping old interfaces but mapping to new structure
export const CreateRepositorySchema = RegisterRepositorySchema;
export type CreateRepositoryData = RegisterRepositoryData;
