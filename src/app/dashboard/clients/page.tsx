"use client";

import { useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { clientColumns } from "./columns";
import { User } from "@/types/User";
import type { RowAction } from "@/components/data-table/types";
import { Eye, Mail, FileText, Trash } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";

export default function Clients() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { clients, fetchClients, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const canDeleteUser = (user: User) => {
        if (!user) return false;
        if (user.userType === "superadmin") return true;
        return false;
    };
    const handleDeleteClick = (row: User) => {
        toast.error("Delete client functionality is not implemented yet.");
    };
    // Row actions for client items
    const rowActions: RowAction<User>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View Profile",
            onClick: (row) => {
                router.push(`/dashboard/clients/${row._id}`);
            },
        },
        {
            icon: <Mail className="w-4 h-4" />,
            label: "Contact",
            onClick: (row) => {
                window.open(`mailto:${row.email}`);
                toast.success(`Opening email to ${row.fullName}`);
            },
        },
        {
            icon: <Trash className="w-4 h-4" />,
            label: "Delete Client",
            variant: "destructive",
            onClick: handleDeleteClick,
            visible: (row) => canDeleteUser(row),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Clients
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage client accounts
                    </p>
                </div>
            </div>

            {isLoading && <ListSkeleton />}
            {error && (
                <div className="py-4 text-red-500 text-center">{error}</div>
            )}

            {!isLoading && !error && (
                <DataTable
                    data={clients}
                    columns={clientColumns}
                    rowActions={rowActions}
                    searchableFields={["fullName", "email", "companyName"]}
                    pageSize={10}
                    rowIdAccessor="_id"
                    initialSort={[{ id: "createdAt", desc: true }]}
                />
            )}
        </div>
    );
}
