import type { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";

export const clientColumns: ColumnDef<User>[] = [
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
        id: "companyName",
        header: "Company",
        accessorFn: (row: User) => row.companyName || "",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.companyName ? (
                    <>
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>{row.original.companyName}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </div>
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
