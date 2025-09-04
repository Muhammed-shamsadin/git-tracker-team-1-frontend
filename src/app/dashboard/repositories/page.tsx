"use client";

import { useState, useCallback } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { repositoryColumns } from "./columns";
import { Repository } from "@/types/Repository";
import type {
    StatusConfig,
    RowAction,
    FilterConfig,
} from "@/components/data-table/types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRoleBasedRepositories } from "@/hooks/use-repositories";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";

export default function Repositories() {
    const { repositories, isLoading, error } = useRoleBasedRepositories();
    const [selectedRows, setSelectedRows] = useState<Repository[]>([]);

    const rowActions: RowAction<Repository>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View",
            onClick: (row) => {
                toast.success(`Viewing repository: ${row.name}`);
            },
        },
        {
            icon: <Edit className="w-4 h-4" />,
            label: "Edit",
            onClick: (row) => {
                toast.success(`Editing repository: ${row.name}`);
            },
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: "Delete",
            onClick: (row) => {
                toast.success(`Deleted repository: ${row.name}`);
            },
        },
    ];

    const statusConfig: StatusConfig = {
        active: { icon: "●", label: "Active", color: "green" },
        moved: { icon: "→", label: "Moved", color: "orange" },
        archived: { icon: "⏸", label: "Archived", color: "gray" },
        deleted: { icon: "–", label: "Deleted", color: "red" },
    };

    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Moved", value: "moved" },
                { label: "Archived", value: "archived" },
                { label: "Deleted", value: "deleted" },
            ],
        },
    ];
    const handleRowSelectionChange = useCallback((rows: Repository[]) => {
        setSelectedRows(rows);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Respositories
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your repositories and their settings.
                    </p>
                </div>
            </div>
            {/* Loading/Error States */}
            {isLoading && <ListSkeleton />}
            {error && (
                <div className="py-4 text-red-500 text-center">{error}</div>
            )}

            {/* Data Table */}
            {!isLoading && !error && (
                <DataTable
                    data={repositories}
                    columns={repositoryColumns}
                    rowActions={rowActions}
                    searchableFields={["name"]}
                    filters={filters}
                    statusConfig={statusConfig}
                    pageSize={10}
                    rowIdAccessor="_id"
                    initialSort={[{ id: "updatedAt", desc: true }]}
                />
            )}
        </div>
    );
}
