import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Member } from "@/stores/projectStore";

// Role color mapping for consistency with MembersTable
const roleVariant: Record<string, string> = {
    owner: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    frontend:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    backend:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    fullstack:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    qa: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    devops: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    designer:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    developer: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export const memberColumns = (projectId: string): ColumnDef<Member>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const member = row.original;
            return (
                <Link
                    href={`/dashboard/projects/${projectId}/members/${member.user_id}`}
                    className="hover:underline"
                >
                    {member.name}
                </Link>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const member = row.original;
            return <span>{member.email}</span>;
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const member = row.original;
            return (
                <Badge
                    className={
                        roleVariant[member.role] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }
                >
                    {member.role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "joined_at",
        header: "Joined At",
        cell: ({ row }) => {
            const member = row.original;
            return (
                <span>{new Date(member.joined_at).toLocaleDateString()}</span>
            );
        },
    },
];
