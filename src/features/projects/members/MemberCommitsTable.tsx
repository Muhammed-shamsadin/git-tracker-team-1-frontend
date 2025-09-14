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
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GitCommit, FileText, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { timeAgo } from "@/lib/utils";
import { useGitDataStore, CommitData } from "@/stores/gitDataStore";

interface MemberCommitsTableProps {
    memberId: string;
    projectId?: string;
    limit?: number;
    title?: string;
    showDescription?: boolean;
}

export function MemberCommitsTable({
    memberId,
    projectId,
    limit = 10,
    title = "Recent Commits",
    showDescription = true,
}: MemberCommitsTableProps) {
    const { id: fallbackProjectId } = useParams();
    const currentProjectId = projectId || (fallbackProjectId as string);

    const {
        memberCommitsForDisplay,
        fetchMemberRecentCommits,
        isLoading,
        error,
    } = useGitDataStore();

    // Fetch member's recent commits
    useEffect(() => {
        if (memberId && currentProjectId) {
            fetchMemberRecentCommits({
                developerId: memberId,
                projectId: currentProjectId,
                limit: limit,
            });
        }
    }, [memberId, currentProjectId, limit, fetchMemberRecentCommits]);

    // Transform commits for display
    const commits = useMemo(() => {
        if (!memberCommitsForDisplay || memberCommitsForDisplay.length === 0)
            return [];

        return memberCommitsForDisplay
            .slice(0, limit)
            .map((commit: CommitData) => {
                // Handle union types for developerId and repoId
                const developer =
                    typeof commit.developerId === "object"
                        ? commit.developerId
                        : {
                              _id: commit.developerId,
                              fullName: "Unknown Developer",
                              email: "",
                          };

                const repository =
                    typeof commit.repoId === "object"
                        ? commit.repoId
                        : { _id: commit.repoId, name: "Unknown Repository" };

                return {
                    id: commit._id,
                    commitHash: commit.commitHash,
                    message: commit.message,
                    repository: repository.name || "Unknown Repository",
                    repositoryId: repository._id,
                    branch: commit.branch,
                    files_changed: commit.stats?.files_changed || 0,
                    lines_added: commit.stats?.lines_added || 0,
                    lines_removed: commit.stats?.lines_removed || 0,
                    timestamp: commit.timestamp,
                    memberName:
                        developer.fullName ||
                        developer.email ||
                        "Unknown Developer",
                };
            });
    }, [memberCommitsForDisplay, limit]);

    // Loading state
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                    {showDescription && (
                        <CardDescription>
                            Loading recent commits...
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commit Message</TableHead>
                                <TableHead>Repository</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Files</TableHead>
                                <TableHead>Changes</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(Math.min(limit, 5))
                                .fill(0)
                                .map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-start gap-2">
                                                <Skeleton className="mt-0.5 w-4 h-4" />
                                                <div className="space-y-1">
                                                    <Skeleton className="w-32 h-4" />
                                                    <Skeleton className="w-16 h-3" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-20 h-6" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-16 h-4" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-8 h-4" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-12 h-4" />
                                                <Skeleton className="w-12 h-4" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-16 h-4" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                    {showDescription && (
                        <CardDescription>
                            Failed to load commits
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground">
                        Failed to load commits
                    </p>
                    <p className="mt-1 text-red-500 text-xs">{error}</p>
                </CardContent>
            </Card>
        );
    }

    // Empty state
    if (!commits || commits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                    {showDescription && (
                        <CardDescription>
                            Latest commits by{" "}
                            {commits[0]?.memberName || "this member"} in this
                            project
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="p-4 text-center">
                    <GitCommit className="mx-auto mb-2 w-8 h-8 text-muted-foreground" />
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
                    {title}
                </CardTitle>
                {showDescription && (
                    <CardDescription>
                        Latest commits by{" "}
                        {commits[0]?.memberName || "this member"} in this
                        project
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Commit Message</TableHead>
                            <TableHead>Repository</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead>Changes</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commits.map((commit) => (
                            <TableRow key={commit.id}>
                                <TableCell>
                                    <div className="flex items-start gap-2">
                                        <FileText className="mt-0.5 w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <Link
                                                href={`/dashboard/repositories/${
                                                    commit.repositoryId ||
                                                    "placeholder"
                                                }/commits/${commit.id}`}
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
                                                #
                                                {commit.commitHash.substring(
                                                    0,
                                                    7
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {commit.repository}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                        {commit.branch}
                                    </code>
                                </TableCell>
                                <TableCell>{commit.files_changed}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="flex items-center gap-1 text-green-600">
                                            <Plus className="w-3 h-3" />
                                            {commit.lines_added}
                                        </span>
                                        <span className="flex items-center gap-1 text-red-600">
                                            <Minus className="w-3 h-3" />
                                            {commit.lines_removed}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {timeAgo(commit.timestamp)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
