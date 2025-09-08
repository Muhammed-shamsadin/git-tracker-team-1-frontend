"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Repository } from "@/types/Repository";
import { User } from "@/types/User";
import { useEffect, useState } from "react";

import { timeAgo } from "@/lib/utils";

interface RepositoryInfoCardProps {
    repository: Repository;
}

export function RepositoryInfoCard({ repository }: RepositoryInfoCardProps) {
    const [developer, setDeveloper] = useState<User | null>(null);
    const [projectName, setProjectName] = useState<string>("");

    useEffect(() => {
        if (repository.projectId) {
            // Handle populated projectId object or string
            if (
                typeof repository.projectId === "object" &&
                repository.projectId !== null
            ) {
                setProjectName(repository.projectId.name);
            } else {
                // Fallback for string projectId
                setProjectName(
                    "Project " +
                        (repository.projectId as string).substring(0, 5)
                );
            }
        }
    }, [repository.projectId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Repository Information</CardTitle>
                <CardDescription>Details about this repository</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {repository.path && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Local Path
                        </span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                            {repository.path}
                        </code>
                    </div>
                )}

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                        {new Date(repository.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{timeAgo(repository.updatedAt)}</span>
                </div>

                {repository.lastSyncedAt && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Last Synced
                        </span>
                        <span>{timeAgo(repository.lastSyncedAt)}</span>
                    </div>
                )}

                {repository.status && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="capitalize">{repository.status}</span>
                    </div>
                )}

                {projectName && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Project</span>
                        <span>{projectName}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
