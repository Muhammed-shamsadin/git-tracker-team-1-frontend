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
                    href={`/projects/${project.id}`}
                    className="hover:underline"
                >
                    {project.name}
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
        accessorKey: "repoCount",
        header: "Repository Count",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.getValue("repoCount")}</Badge>
        ),
    },
    {
        accessorKey: "memberCount",
        header: "Member Count",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.getValue("memberCount")}</Badge>
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
        cell: ({ row }) => {
            const updatedDate = new Date(row.getValue("updatedDate"));
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
