"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { developerColumns } from "./columns";
import { User } from "@/types/User";
import type { RowAction } from "@/components/data-table/types";
import { Eye, Mail } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";

export default function Developers() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { developers, fetchDevelopers, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchDevelopers();
    }, [fetchDevelopers]);

    // Row actions for developer items
    const rowActions: RowAction<User>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View Profile",
            onClick: (row) => {
                router.push(`/dashboard/developers/${row._id}`);
                // This would navigate to the developer's profile page
            },
        },
        {
            icon: <Mail className="w-4 h-4" />,
            label: "Contact",
            onClick: (row) => {
                // Could open a modal to send a message or simply open the email client
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
                        Developers
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage developers on the platform
                    </p>
                </div>
            </div>

            {isLoading && <ListSkeleton />}
            {error && (
                <div className="py-4 text-red-500 text-center">{error}</div>
            )}

            {!isLoading && !error && (
                <DataTable
                    data={developers}
                    columns={developerColumns}
                    rowActions={rowActions}
                    searchableFields={["fullName", "email"]}
                    pageSize={10}
                    rowIdAccessor="_id"
                    initialSort={[{ id: "updatedAt", desc: true }]}
                />
            )}
        </div>
    );
}
