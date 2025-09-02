"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    GitCommit,
    Calendar,
    FileText,
    Plus,
    Minus,
    Copy,
    ExternalLink,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { Commit } from "@/types/Repository";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryStore } from "@/stores/repositoryStore";

interface CommitResponse {
    success: boolean;
    data: {
        commit: Commit;
        message: string;
    };
}

// Define a type for the repository response
interface RepositoryResponse {
    success: boolean;
    data: {
        repository: {
            _id: string;
            name: string;
            [key: string]: any;
        };
        message: string;
    };
}

interface CommitWithRepository extends Commit {
    repository?: {
        id: string;
        name: string;
    };
    short_id?: string;
}

const getFileTypeIcon = (fileName: string, added: number, removed: number) => {
    if (added > 0 && removed === 0) {
        return <Plus className="w-4 h-4 text-green-600" />;
    } else if (removed > 0 && added === 0) {
        return <Minus className="w-4 h-4 text-red-600" />;
    } else {
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
};

const getFileTypeColor = (fileName: string, added: number, removed: number) => {
    if (added > 0 && removed === 0) {
        return "text-green-600";
    } else if (removed > 0 && added === 0) {
        return "text-red-600";
    } else {
        return "text-blue-600";
    }
};

const getFileType = (
    fileName: string,
    added: number,
    removed: number
): string => {
    if (added > 0 && removed === 0) {
        return "added";
    } else if (removed > 0 && added === 0) {
        return "removed";
    } else {
        return "modified";
    }
};

export default function CommitDetailsPage() {
    const params = useParams();
    const repoId = params.id as string;
    const commitId = params.commitid as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commitData, setCommitData] = useState<CommitWithRepository | null>(
        null
    );
    const [repoName, setRepoName] = useState<string>("repository");
    const { currentRepository } = useRepositoryStore();
    useEffect(() => {
        const fetchCommitData = async () => {
            try {
                setLoading(true);
                const response = await api.get<CommitResponse>(
                    `/git-data/${commitId}`
                );

                if (response.data.success && response.data.data.commit) {
                    const commit = response.data.data.commit;

                    // Get repository name
                    try {
                        const repoResponse = await api.get<RepositoryResponse>(
                            `/repositories/${commit.repoId}`
                        );

                        if (
                            repoResponse.data.success &&
                            repoResponse.data.data.repository
                        ) {
                            const repoName =
                                currentRepository?.name || "Unknown Repository";
                            setRepoName(repoName);

                            // Add repository info to commit data
                            setCommitData({
                                ...commit,
                                repository: {
                                    id: commit.repoId,
                                    name: repoName,
                                },
                                short_id: commit.commitHash
                                    ? commit.commitHash.substring(0, 7)
                                    : "",
                            });
                        } else {
                            throw new Error("Repository data not available");
                        }
                    } catch (repoError) {
                        console.error("Error fetching repository:", repoError);
                        // If repo fetch fails, still set commit data
                        setCommitData({
                            ...commit,
                            repository: {
                                id: commit.repoId,
                                name: "Unknown Repository",
                            },
                            short_id: commit.commitHash
                                ? commit.commitHash.substring(0, 7)
                                : "",
                        });
                    }
                } else {
                    setError("Failed to fetch commit data");
                }
            } catch (err) {
                setError("An error occurred while fetching commit data");
                console.error("Commit fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (commitId) {
            fetchCommitData();
        } else {
            setError("No commit ID provided");
            setLoading(false);
        }
    }, [commitId, repoId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-32 h-9" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-full h-48" />
                </div>
                <div className="gap-4 grid md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-24" />
                    ))}
                </div>
                <Skeleton className="w-full h-96" />
            </div>
        );
    }

    if (error || !commitData) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh]">
                <GitCommit className="mb-4 w-12 h-12 text-muted-foreground" />
                <h2 className="mb-2 font-bold text-2xl">
                    Failed to load commit
                </h2>
                <p className="text-muted-foreground">
                    {error || "Commit data not available"}
                </p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/dashboard/repositories/${repoId}`}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to repository
                    </Link>
                </Button>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/repositories/${repoId}`}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to {commitData.repository?.name}
                    </Link>
                </Button>
            </div>

            {/* Commit Header */}
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <GitCommit className="w-8 h-8 text-muted-foreground" />
                            <h1 className="font-bold text-3xl tracking-tight">
                                Commit Details
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg">
                            {commitData.message}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (commitData.commitHash) {
                                    navigator.clipboard.writeText(
                                        commitData.commitHash
                                    );
                                }
                            }}
                        >
                            <Copy className="mr-2 w-4 h-4" />
                            Copy SHA
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // This is a placeholder action since we don't have the actual GitHub URL
                                alert("GitHub link not available");
                            }}
                        >
                            <ExternalLink className="mr-2 w-4 h-4" />
                            View on GitHub
                        </Button>
                    </div>
                </div>

                {/* Commit Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="gap-4 grid md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback>DEV</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">
                                            Developer
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            ID: {commitData.developerId}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(
                                        commitData.timestamp
                                    ).toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Commit SHA
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs">
                                        {commitData.short_id}
                                    </code>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Branch
                                    </span>
                                    <Badge variant="outline">
                                        {commitData.branch}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Repository
                                    </span>
                                    <span>{commitData.repository?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Parent
                                    </span>
                                    <code className="bg-muted px-2 py-1 rounded text-xs">
                                        {commitData.parentCommit?.substring(
                                            0,
                                            7
                                        ) || "None"}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Commit Stats */}
            <div className="gap-4 grid md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Files Changed
                        </CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {commitData.changes?.length ||
                                commitData.stats?.files_changed ||
                                0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Files Added
                        </CardTitle>
                        <Plus className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-green-600 text-2xl">
                            {commitData.stats?.files_added || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Lines Added
                        </CardTitle>
                        <Plus className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-green-600 text-2xl">
                            +
                            {commitData.stats?.lines_added ||
                                (commitData.changes &&
                                commitData.changes.length > 0
                                    ? commitData.changes.reduce(
                                          (sum, change) =>
                                              sum + (change.added || 0),
                                          0
                                      )
                                    : 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Lines Removed
                        </CardTitle>
                        <Minus className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-red-600 text-2xl">
                            -
                            {commitData.stats?.lines_removed ||
                                (commitData.changes &&
                                commitData.changes.length > 0
                                    ? commitData.changes.reduce(
                                          (sum, change) =>
                                              sum + (change.removed || 0),
                                          0
                                      )
                                    : 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Files Changed */}
            {commitData.changes &&
                Array.isArray(commitData.changes) &&
                commitData.changes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Files Changed
                            </CardTitle>
                            <CardDescription>
                                {commitData.changes.length} files changed with{" "}
                                {commitData.changes.reduce(
                                    (sum, change) => sum + (change.added || 0),
                                    0
                                )}{" "}
                                additions and{" "}
                                {commitData.changes.reduce(
                                    (sum, change) =>
                                        sum + (change.removed || 0),
                                    0
                                )}{" "}
                                deletions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>File</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Lines Added</TableHead>
                                        <TableHead>Lines Removed</TableHead>
                                        <TableHead>Total Changes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commitData.changes.map((change, index) => {
                                        const added = change.added || 0;
                                        const removed = change.removed || 0;
                                        const fileType = getFileType(
                                            change.fileName || "",
                                            added,
                                            removed
                                        );
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getFileTypeIcon(
                                                            change.fileName ||
                                                                "",
                                                            added,
                                                            removed
                                                        )}
                                                        <code className="text-sm">
                                                            {change.fileName ||
                                                                ""}
                                                        </code>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={getFileTypeColor(
                                                            change.fileName ||
                                                                "",
                                                            added,
                                                            removed
                                                        )}
                                                    >
                                                        {fileType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-green-600">
                                                        +{added}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-red-600">
                                                        -{removed}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {added + removed}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
        </div>
    );
}
