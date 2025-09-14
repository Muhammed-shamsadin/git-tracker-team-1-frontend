"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus, Minus, GitCommit } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import { CommitData } from "@/stores/gitDataStore";

// Use CommitData interface from gitDataStore for consistency
export type Commit = CommitData;

export const commitColumns: ColumnDef<Commit>[] = [
    {
        accessorKey: "message",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                    Message
                    <ArrowUpDown className="ml-2 w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row, getValue }) => {
            const message = getValue() as string;
            const commit = row.original;
            const firstLine = message.split("\n")[0];
            const truncatedMessage =
                firstLine.length > 60
                    ? firstLine.slice(0, 60) + "..."
                    : firstLine;

            return (
                <div className="space-y-1">
                    <Link
                        href={`/dashboard/repositories/${
                            typeof commit.repoId === "string"
                                ? commit.repoId
                                : commit.repoId._id
                        }/commits/${commit._id}`}
                        className="block font-medium text-foreground hover:underline"
                    >
                        {truncatedMessage}
                    </Link>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <GitCommit className="w-3 h-3" />
                        <code className="bg-muted px-1 py-0.5 rounded">
                            {commit.commitHash.substring(0, 7)}
                        </code>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "author",
        header: "Author",
        cell: ({ getValue, row }) => {
            const author = getValue() as
                | { name: string; avatar: string }
                | undefined;
            const commit = row.original;

            // Fallback to developerId if author not available
            const developerId =
                typeof commit.developerId === "string"
                    ? commit.developerId
                    : commit.developerId._id;
            const developerName =
                typeof commit.developerId === "object"
                    ? commit.developerId.fullName || commit.developerId.email
                    : null;

            const displayName =
                author?.name ||
                developerName ||
                `Developer ${developerId.substring(0, 8)}`;

            return (
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-medium text-xs">
                        {displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                    </div>
                    <span className="text-sm">{displayName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "branch",
        header: "Branch",
        cell: ({ getValue }) => {
            const branch = getValue() as string;
            return (
                <Badge variant="outline" className="font-mono text-xs">
                    {branch}
                </Badge>
            );
        },
    },
    {
        accessorKey: "stats",
        header: "Changes",
        cell: ({ getValue, row }) => {
            const stats = getValue() as Commit["stats"];
            const commit = row.original;

            // Fallback to calculating from changes array if stats not available
            const linesAdded =
                stats?.lines_added ||
                commit.changes?.reduce(
                    (sum, change) => sum + change.added,
                    0
                ) ||
                0;
            const linesRemoved =
                stats?.lines_removed ||
                commit.changes?.reduce(
                    (sum, change) => sum + change.removed,
                    0
                ) ||
                0;
            const filesChanged =
                stats?.files_changed || commit.changes?.length || 0;

            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-green-600">
                            <Plus className="w-3 h-3" />
                            {linesAdded}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                            <Minus className="w-3 h-3" />
                            {linesRemoved}
                        </span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                        {filesChanged} file{filesChanged !== 1 ? "s" : ""}{" "}
                        changed
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                    Date
                    <ArrowUpDown className="ml-2 w-4 h-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const timestamp = getValue() as string;
            return (
                <div className="text-muted-foreground text-sm">
                    {timeAgo(timestamp)}
                </div>
            );
        },
        sortingFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.timestamp);
            const dateB = new Date(rowB.original.timestamp);
            return dateA.getTime() - dateB.getTime();
        },
    },
];
