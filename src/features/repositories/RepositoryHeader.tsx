"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Activity,
    ExternalLink,
    Settings,
    GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repository } from "@/types/Repository";
import { useState, useEffect } from "react";
import { useRepositoryStore } from "@/stores/repositoryStore";
import { set } from "zod";

interface RepositoryHeaderProps {
    repository: Repository;
}

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
    const { currentRepository } = useRepositoryStore();
    const [projectName, setProjectName] = useState<string>("");
    const [developerName, setDeveloperName] = useState<string>("");

    useEffect(() => {
        // Handle populated projectId object or string
        if (
            typeof repository.projectId === "object" &&
            repository.projectId !== null
        ) {
            setProjectName(repository.projectId.name);
        } else {
            setProjectName(repository.projectId as string);
        }

        // Handle populated developerId object or string
        if (
            typeof repository.developerId === "object" &&
            repository.developerId !== null
        ) {
            setDeveloperName(repository.developerId.fullName);
        } else {
            setDeveloperName(repository.developerId as string);
        }
    }, [repository]);

    return (
        <>
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/repositories">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Repositories
                    </Link>
                </Button>
            </div>

            {/* Repository Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <GitBranch className="w-8 h-8 text-muted-foreground" />
                        <h1 className="font-bold text-3xl tracking-tight">
                            {repository.name}
                        </h1>
                    </div>
                    <p className="max-w-2xl text-muted-foreground">
                        {repository.description}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(
                                repository.createdAt
                            ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Last updated{" "}
                            {new Date(
                                repository.updatedAt
                            ).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {projectName && (
                            <Badge variant="outline">
                                Project: {projectName}
                            </Badge>
                        )}
                        {developerName && (
                            <Badge variant="outline" className="font-medium">
                                Owner: {developerName}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
