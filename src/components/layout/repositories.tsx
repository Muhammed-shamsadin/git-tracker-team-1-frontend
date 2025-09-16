"use client";
// import { mockRepositories } from "@/data/repositories";
import { Repository } from "@/types/Repository";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    GitBranch,
    GitCommit,
    Clock,
    MoreHorizontal,
    Plus,
    ExternalLink,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// interface Repository {
//   id: string;
//   name: string;
//   branches: number;
//   commits: number;
//   lastCommit: string;
//   status: "active" | "archived" | "deleted";
//   url?: string;
// }

// const repositories: Repository[] = [
//   {
//     id: "1",
//     name: "frontend",
//     branches: 3,
//     commits: 1247,
//     lastCommit: "2 hours ago",
//     status: "active",
//     url: "https://github.com/company/frontend",
//   },
//   {
//     id: "2",
//     name: "backend",
//     branches: 5,
//     commits: 892,
//     lastCommit: "4 hours ago",
//     status: "active",
//     url: "https://github.com/company/backend",
//   },
//   {
//     id: "3",
//     name: "shared-components",
//     branches: 3,
//     commits: 423,
//     lastCommit: "1 day ago",
//     status: "active",
//     url: "https://github.com/company/shared-components",
//   },
// ];

export default function RepositoriesPage() {
    // const [repos, setRepos] = useState<Repository[]>(mockRepositories);

    const formatCommitCount = (count: number) => {
        return count.toLocaleString();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-2xl tracking-tight">
                        Connected Repositories
                    </h2>
                    <p className="text-muted-foreground">
                        Manage repositories connected to this project
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Connect Repository
                </Button>
            </div>

            {/* <div className="space-y-4">
                {repos.map((repo) => (
                    <Card key={repo._id}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex justify-center items-center bg-muted rounded-lg w-10 h-10">
                                        <GitBranch className="w-5 h-5" />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">
                                                {repo.name}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100 hover:bg-blue-100 text-blue-800"
                                            >
                                                {repo.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                            <div className="flex items-center gap-1">
                                                <GitBranch className="w-3 h-3" />
                                                <span>
                                                    {repo.branchCount} branches
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <GitCommit className="w-3 h-3" />
                                                <span>
                                                    {formatCommitCount(
                                                        repo.commitCount
                                                    )}{" "}
                                                    commits
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    Last commit:{" "}
                                                    {repo.lastCommit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {repo.remoteUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={repo.remoteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="mr-2 w-3 h-3" />
                                                View on GitHub
                                            </a>
                                        </Button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Sync Repository
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Configure Webhooks
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Disconnect
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div> */}

            {/* <div className="gap-4 grid md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="font-bold text-2xl">{repos.length}</div>
                        <p className="text-muted-foreground text-xs">
                            Total Repositories
                        </p>
                    </CardContent>
                </Card> */}

                {/* <Card>
                    <CardContent className="p-4">
                        <div className="font-bold text-2xl">
                            {repos.reduce(
                                (acc, repo) => acc + repo.branchCount,
                                0
                            )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Total Branches
                        </p>
                    </CardContent>
                </Card> */}

                {/* <Card>
                    <CardContent className="p-4">
                        <div className="font-bold text-2xl">
                            {formatCommitCount(
                                repos.reduce(
                                    (acc, repo) => acc + repo.commitCount,
                                    0
                                )
                            )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Total Commits
                        </p>
                    </CardContent>
                </Card> */}

                {/* <Card>
                    <CardContent className="p-4">
                        <div className="font-bold text-2xl">
                            {
                                repos.filter((repo) => repo.status === "active")
                                    .length
                            }
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Active Repos
                        </p>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );
}
