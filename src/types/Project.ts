export interface Project {
    id: string; // Unique identifier for the project
    name: string; // Name of the project
    description: string; // Optional description of the project
    owner: string; // User ID of the project owner
    createdDate: string; // ISO date string
    updatedDate: string; // ISO date string
    status: "active" | "archived" | "completed";
    members: string[]; // Array of user IDs
    memberCount: number; // Number of members in the project
    repositories: string[]; // Array of repository IDs
    repoCount: number; // Number of repositories associated with the project
    startDate?: string; // Optional start date in ISO format
    tags?: string[]; // Optional array of tags
}
