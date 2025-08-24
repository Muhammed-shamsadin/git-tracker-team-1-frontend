"use client";

import { Repository } from "@/types/Repository";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export const repositoryColumns: ColumnDef<Repository>[] = [
    {
        accessorKey: "name",
        header: "Repository",
        cell: ({ row }) => {
            const repository = row.original;
            return (
                <Link
                    href={`/dashboard/repositories/${repository._id}`}
                    className="hover:underline"
                >
                    {repository.name}
                </Link>
            );
        },
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
            return (
                <div className="text-center">
                    {timeAgo(row.getValue("updatedDate") as Date)}
                </div>
            );
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
