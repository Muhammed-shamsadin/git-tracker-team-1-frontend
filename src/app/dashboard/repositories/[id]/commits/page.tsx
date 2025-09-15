"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/DataTable";
import { commitColumns, type Commit } from "./columns";
import type { RowAction, FilterConfig } from "@/components/data-table/types";
import { Eye, GitBranch, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useRepositoryStore } from "@/stores/repositoryStore";
import { useGitDataStore } from "@/stores/gitDataStore";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RepoCommitsList() {
    const params = useParams();
    const router = useRouter();
    const repositoryId = params.id as string;

    const { fetchRepositoryById, currentRepository, isLoading } =
        useRepositoryStore();

    const { fetchCommits } = useGitDataStore();

    const [commits, setCommits] = useState<Commit[]>([]);
    const [selectedRows, setSelectedRows] = useState<Commit[]>([]);
    const [isLoadingCommits, setIsLoadingCommits] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch repository details
    useEffect(() => {
        if (repositoryId) {
            fetchRepositoryById(repositoryId);
        }
    }, [repositoryId, fetchRepositoryById]);

    // Fetch commits
    const loadCommits = useCallback(
        async (page = 1, append = false) => {
            if (!repositoryId) return;

            setIsLoadingCommits(true);
            setError(null);

            try {
                const response = await fetchCommits({
                    page,
                    limit: 20,
                    repoId: repositoryId,
                });

                const fetchedCommits = response?.commits || [];

                if (fetchedCommits.length > 0) {
                    setCommits((prev) =>
                        append ? [...prev, ...fetchedCommits] : fetchedCommits
                    );
                    setHasMore(fetchedCommits.length === 20); // If we got less than 20, no more pages
                } else {
                    setHasMore(false);
                    if (!append) {
                        setCommits([]);
                    }
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch commits");
                toast.error("Failed to fetch commits");
            } finally {
                setIsLoadingCommits(false);
            }
        },
        [repositoryId, fetchCommits]
    );

    // Initial load
    useEffect(() => {
        loadCommits(1, false);
    }, [loadCommits]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoadingCommits) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadCommits(nextPage, true);
        }
    }, [currentPage, hasMore, isLoadingCommits, loadCommits]);

    const handleRowSelectionChange = useCallback((rows: Commit[]) => {
        setSelectedRows(rows);
    }, []);

    // Row actions
    const rowActions: RowAction<Commit>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View Details",
            onClick: (row) => {
                router.push(
                    `/dashboard/repositories/${repositoryId}/commits/${row._id}`
                );
            },
        },
    ];

    // Filters
    const filters: FilterConfig[] = [
        {
            key: "branch",
            label: "Branch",
            type: "select",
            options: Array.from(
                new Set(commits.map((commit) => commit.branch))
            ).map((branch) => ({ label: branch, value: branch })),
        },
    ];

    const repositoryName = currentRepository?.name || "Repository";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                {/* Title and Actions */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
                            <GitBranch className="w-8 h-8" />
                            Repository Commits
                        </h1>
                        <p className="text-muted-foreground">
                            Browse and explore all commits in {repositoryName}
                        </p>
                        {commits.length > 0 && (
                            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                <span>{commits.length} commits loaded</span>
                                {hasMore && <span>• More available</span>}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={`/dashboard/repositories/${repositoryId}`}
                            >
                                Back to Repository
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Loading/Error States */}
            {(isLoading || isLoadingCommits) && commits.length === 0 && (
                <ListSkeleton />
            )}

            {error && !isLoadingCommits && (
                <div className="py-8 text-center">
                    <div className="mb-2 text-red-500">{error}</div>
                    <Button
                        variant="outline"
                        onClick={() => loadCommits(1, false)}
                        disabled={isLoadingCommits}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Data Table */}
            {!isLoading && !error && (
                <div className="space-y-4">
                    <DataTable
                        data={commits}
                        columns={commitColumns}
                        rowActions={rowActions}
                        searchableFields={["message", "commitHash"]}
                        filters={filters}
                        enableRowSelection={false}
                        onRowSelectionChange={handleRowSelectionChange}
                        pageSize={20}
                        rowIdAccessor="_id"
                        initialSort={[{ id: "timestamp", desc: true }]}
                    />

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoadingCommits}
                            >
                                {isLoadingCommits
                                    ? "Loading..."
                                    : "Load More Commits"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!isLoading &&
                !isLoadingCommits &&
                !error &&
                commits.length === 0 && (
                    <div className="py-12 text-center">
                        <GitBranch className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                        <h3 className="mb-2 font-semibold text-lg">
                            No commits found
                        </h3>
                        <p className="text-muted-foreground">
                            This repository doesn't have any commits yet.
                        </p>
                    </div>
                )}
        </div>
    );
}
