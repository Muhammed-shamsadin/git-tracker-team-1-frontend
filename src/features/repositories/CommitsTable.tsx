"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitCommit, Plus, Minus } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface CommitChange {
    fileName: string;
    added: number;
    removed: number;
}

interface CommitStats {
    files_changed: number;
    files_added: number;
    files_removed: number;
    lines_added: number;
    lines_removed: number;
}

interface Commit {
    _id: string;
    repoId: string;
    developerId: string;
    projectId: string;
    commitHash: string;
    message: string;
    branch: string;
    timestamp: string;
    stats: CommitStats;
    changes: CommitChange[];
    parentCommit: string;
    desktopSyncedAt: string;
    createdAt: string;
    updatedAt: string;
    // For backward compatibility with UI
    author?: {
        name: string;
        avatar: string;
    };
}

interface CommitsTableProps {
    commits: Commit[];
    repositoryId?: string;
    isLoading?: boolean;
}

export function CommitsTable({
    commits = [],
    repositoryId,
    isLoading = false,
}: CommitsTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        Recent Commits
                    </CardTitle>
                    <CardDescription>
                        Latest commits in this repository
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground">Loading commits...</p>
                </CardContent>
            </Card>
        );
    }

    if (!commits || commits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        Recent Commits
                    </CardTitle>
                    <CardDescription>
                        Latest commits in this repository
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground">No commits found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitCommit className="w-5 h-5" />
                    Recent Commits
                </CardTitle>
                <CardDescription>
                    Latest commits in this repository
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead>Changes</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commits.map((commit) => {
                            // Calculate total lines added/removed from changes
                            const totalLinesAdded =
                                commit.stats?.lines_added ||
                                commit.changes?.reduce(
                                    (sum, change) => sum + change.added,
                                    0
                                ) ||
                                0;
                            const totalLinesRemoved =
                                commit.stats?.lines_removed ||
                                commit.changes?.reduce(
                                    (sum, change) => sum + change.removed,
                                    0
                                ) ||
                                0;

                            return (
                                <TableRow key={commit._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage
                                                    src={
                                                        commit.author?.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={
                                                        commit.author?.name ||
                                                        "Developer"
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {commit.author?.name?.[0] ||
                                                        "D"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                                {commit.author?.name ||
                                                    "Developer"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <Link
                                                href={`/dashboard/repositories/${
                                                    commit.repoId ||
                                                    "placeholder"
                                                }/commits/${commit._id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {commit.message.split("\n")[0]
                                                    .length > 50
                                                    ? commit.message
                                                          .split("\n")[0]
                                                          .slice(0, 50) + "..."
                                                    : commit.message.split(
                                                          "\n"
                                                      )[0]}
                                            </Link>
                                            <p className="text-muted-foreground text-xs">
                                                {commit.commitHash.substring(
                                                    0,
                                                    7
                                                )}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                            {commit.branch}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {commit.stats?.files_changed ||
                                            commit.changes?.length ||
                                            0}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="flex items-center gap-1 text-green-600">
                                                <Plus className="w-3 h-3" />
                                                {totalLinesAdded}
                                            </span>
                                            <span className="flex items-center gap-1 text-red-600">
                                                <Minus className="w-3 h-3" />
                                                {totalLinesRemoved}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {timeAgo(commit.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/dashboard/repositories/${commit.repoId}/commits/${commit._id}`}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
