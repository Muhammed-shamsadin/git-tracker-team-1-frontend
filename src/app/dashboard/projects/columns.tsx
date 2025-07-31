"use client";

import { Project } from "@/types/Project";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const projectColomns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: "Project",
        cell: ({ row }) => {
            const project = row.original;
            return (
                <Link
                    href={`/dashboard/projects/${project._id}`}
                    className="hover:underline"
                >
                    {project.name}
                </Link>
            );
        },
    },

    // {
    //     accessorKey: "owner",
    //     header: "Owner",
    //     cell: ({ row }) => row.getValue("owner"),
    // },
    {
        header: "Repository Count",
        accessorFn: (row) => row.repositories?.length ?? 0,
        cell: ({ row }) => {
            const repositories = row.original.repositories || [];
            return <Badge variant="secondary">{repositories.length}</Badge>;
        },
    },
    {
        header: "Developers Count",
        accessorFn: (row) => row.developers?.length ?? 0,
        cell: ({ row }) => {
            const developers = row.original.developers || [];
            return <Badge variant="secondary">{developers.length}</Badge>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => (
            <div className="text-center">
                {new Date(row.original.createdAt).toLocaleDateString()}
            </div>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: "Last Updated",
        accessorFn: (row: any) => new Date(row.updatedAt),
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
            const dateA = rowA.getValue(columnId) as Date;
            const dateB = rowB.getValue(columnId) as Date;
            return dateA.getTime() - dateB.getTime();
        },
        cell: ({ row }) => {
            const updatedDate = new Date(row.original.updatedAt);
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
