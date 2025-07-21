export interface Repository {
    id: string; // Unique identifier for the repository
    name: string; // Name of the repository
    description?: string; // Optional description of the repository
    owner: string; // User ID of the repository owner
    projectId: string; // ID of the project this repository belongs to
    path: string; // Path to the repository on the server or local filesystem
    remoteUrl?: string; // Optional remote URL for the repository
    branchCount: number; // Number of branches in the repository
    commitCount: number; // Number of commits in the repository
    lastCommit?: string; // Optional date of the last commit in ISO format
    commits: []; // Array of commit objects (if needed, define a Commit interface)
    status: "active" | "archived" | "completed"; // Status of the repository
    tags?: string[]; // Optional array of tags associated with the repository
    lastActivityDate?: string; // Optional date of the last activity in ISO format
    createdDate: string; // ISO date string
    updatedDate: string; // ISO date string
}
