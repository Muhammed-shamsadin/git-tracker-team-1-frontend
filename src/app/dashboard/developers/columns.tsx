import type { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export const developerColumns: ColumnDef<User>[] = [
    {
        id: "fullName",
        header: "Name",
        accessorFn: (row: User) => row.fullName,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                    <AvatarImage
                        src={row.original.profileImage || ""}
                        alt={row.original.fullName}
                    />
                    <AvatarFallback>
                        {row.original.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Link
                    href={`/dashboard/developers/${row.original._id}`}
                    className="hover:underline"
                >
                    {row.original.fullName}
                </Link>
            </div>
        ),
    },
    {
        id: "email",
        header: "Email",
        accessorFn: (row: User) => row.email,
    },
    {
        id: "registeredRepos",
        header: "Repository Count",
        accessorFn: (row: User) => row.registeredRepos?.length || 0,
        cell: ({ row }) => (
            <span>{row.original.registeredRepos?.length || 0}</span>
        ),
    },
    {
        id: "createdAt",
        header: "Joined",
        accessorFn: (row: User) => row.createdAt,
        cell: ({ row }) => (
            <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        ),
    },
    {
        id: "updatedAt",
        header: "Last Updated",
        accessorFn: (row: User) => row.updatedAt,
        cell: ({ row }) => <span>{timeAgo(row.original.updatedAt)}</span>,
    },
    {
        id: "isActive",
        header: "Status",
        accessorFn: (row: User) => row.isActive,
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.isActive !== false ? "default" : "secondary"
                }
            >
                {row.original.isActive !== false ? "Active" : "Inactive"}
            </Badge>
        ),
    },
];
