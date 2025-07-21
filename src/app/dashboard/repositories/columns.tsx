"use client";

import { Repository } from "@/types/Repository";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const repositoryColumns: ColumnDef<Repository>[] = [
    {
        accessorKey: "name",
        header: "Repository",
        cell: ({ row }) => {
            const repository = row.original;
            return (
                <Link
                    href={`/dashboard/repositories/${repository.id}`}
                    className="hover:underline"
                >
                    {repository.name}
                </Link>
            );
        },
    },
    {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => row.getValue("owner"),
    },
    {
        accessorKey: "projectId",
        header: "Project ID",
        cell: ({ row }) => (
            <Link
                href={`/dashboard/projects/${row.getValue("projectId")}`}
                className="hover:underline"
            >
                {row.getValue("projectId")}
            </Link>
        ),
    },
    {
        accessorKey: "branchCount",
        header: "Branch Count",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.getValue("branchCount")}</Badge>
        ),
    },
    {
        accessorKey: "commitCount",
        header: "Commit Count",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.getValue("commitCount")}</Badge>
        ),
    },
    {
        accessorKey: "createdDate",
        header: "Created Date",
        cell: ({ row }) => (
            <div className="text-center">
                {new Date(row.getValue("createdDate")).toLocaleDateString()}
            </div>
        ),
    },
    {
        accessorKey: "updatedDate",
        header: "Last Updated",
        accessorFn: (row: any) => new Date(row.updatedDate),
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
            const dateA = rowA.getValue(columnId) as Date;
            const dateB = rowB.getValue(columnId) as Date;
            return dateA.getTime() - dateB.getTime();
        },
        cell: ({ row }) => {
            const updatedDate = row.getValue("updatedDate") as Date;
            const now = new Date();
            const timeDiff = Math.abs(now.getTime() - updatedDate.getTime());
            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) return `${days} days ago`;
            if (hours > 0) return `${hours} hours ago`;
            if (minutes > 0) return `${minutes} minutes ago`;
            return `${seconds} seconds ago`;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={
                    row.getValue("status") === "active"
                        ? "default"
                        : row.getValue("status") === "archived"
                        ? "secondary"
                        : "destructive"
                }
            >
                {row.getValue("status")}
            </Badge>
        ),
    },
];
