"use client";

import { useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { clientColumns } from "./columns";
import { User } from "@/types/User";
import type { RowAction } from "@/components/data-table/types";
import { Eye, Mail, FileText } from "lucide-react";
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
            icon: <FileText className="w-4 h-4" />,
            label: "View Projects",
            onClick: (row) => {
                router.push(`/dashboard/projects?clientId=${row._id}`);
                toast.success(`Viewing projects for ${row.fullName}`);
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
