"use client";

import { Project } from "@/types/Project";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
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
    //     header: "Client",
    //     accessorFn: (row) =>
    //         typeof row.clientId === "object"
    //             ? row.clientId?.name
    //             : row.clientId,
    //     cell: ({ row }) => {
    //         const client = row.original.clientId;
    //         return (
    //             <span>
    //                 {typeof client === "object" ? client?.name : client}
    //             </span>
    //         );
    //     },
    // },
    {
        header: "Repository Count",
        accessorFn: (row) => row.repositories?.length ?? 0,
        cell: ({ row }) => {
            const repositories = row.original.repositories || [];
            return <Badge variant="secondary">{repositories.length}</Badge>;
        },
    },
    // {
    //     header: "Developer Count",
    //     accessorFn: (row) =>
    //         Array.isArray(row.projectDevelopers)
    //             ? row.projectDevelopers.length
    //             : row.developers?.length ?? 0,
    //     cell: ({ row }) => {
    //         const devs =
    //             row.original.projectDevelopers || row.original.developers || [];
    //         return <Badge variant="secondary">{devs.length}</Badge>;
    //     },
    // },
    {
        header: "Repo Limit",
        accessorFn: (row) => row.repoLimit ?? 1,
        cell: ({ row }) => <span>{row.original.repoLimit ?? 1}</span>,
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
        cell: ({ row }) => timeAgo(row.original.updatedAt),
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
                        : row.getValue("status") === "deleted"
                        ? "destructive"
                        : "outline"
                }
            >
                {row.getValue("status")}
            </Badge>
        ),
    },
];
