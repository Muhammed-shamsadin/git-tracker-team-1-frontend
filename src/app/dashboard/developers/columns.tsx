import type { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

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
                <span>{row.original.fullName}</span>
            </div>
        ),
    },
    {
        id: "email",
        header: "Email",
        accessorFn: (row: User) => row.email,
    },
    {
        id: "skills",
        header: "Skills",
        accessorFn: (row: User) => row.profile?.skills?.join(", ") || "",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.profile?.skills
                    ?.slice(0, 3)
                    .map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">
                            {skill}
                        </Badge>
                    ))}
                {(row.original.profile?.skills?.length || 0) > 3 && (
                    <Badge variant="outline">
                        +{(row.original.profile?.skills?.length || 0) - 3}
                    </Badge>
                )}
            </div>
        ),
    },
    {
        id: "workspaces",
        header: "Project Count",
        accessorFn: (row: User) => row.workspaces?.length || 0,
        cell: ({ row }) => <span>{row.original.workspaces?.length || 0}</span>,
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
