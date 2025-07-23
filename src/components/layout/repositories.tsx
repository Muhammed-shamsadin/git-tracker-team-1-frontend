"use client";
import { mockRepositories } from "@/data/repositories";
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
//   status: "active" | "inactive";
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
  const [repos, setRepos] = useState<Repository[]>(mockRepositories);

  const formatCommitCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Connected Repositories
          </h2>
          <p className="text-muted-foreground">
            Manage repositories connected to this project
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Repository
        </Button>
      </div>

      <div className="space-y-4">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <GitBranch className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{repo.name}</h3>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                      >
                        {repo.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        <span>{repo.branchCount} branches</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        <span>
                          {formatCommitCount(repo.commitCount)} commits
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last commit: {repo.lastCommit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {repo.remoteUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={repo.remoteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View on GitHub
                      </a>
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Sync Repository</DropdownMenuItem>
                      <DropdownMenuItem>Configure Webhooks</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
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
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{repos.length}</div>
            <p className="text-xs text-muted-foreground">Total Repositories</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {repos.reduce((acc, repo) => acc + repo.branchCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total Branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatCommitCount(
                repos.reduce((acc, repo) => acc + repo.commitCount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total Commits</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {repos.filter((repo) => repo.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Active Repos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
