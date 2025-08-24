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
import { mockRepositories } from "@/data/repositories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useRoleBasedRepositories } from "@/hooks/use-repositories";

export default function Repositories() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { repositories, paginatedRepositories, isLoading, error, userRole } =
        useRoleBasedRepositories();
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
        active: { icon: "🟢", label: "Active", color: "green" },
        archived: { icon: "🔒", label: "Archived", color: "gray" },
        completed: { icon: "✅", label: "Completed", color: "blue" },
    };

    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Archived", value: "archived" },
                { label: "Completed", value: "completed" },
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
                {userRole === "developer" && (
                    <Button>
                        <Plus className="mr-2 w-4 h-4" />
                        New Repository
                    </Button>
                )}
            </div>
            {/* Data Table */}
            <DataTable
                data={repositories}
                columns={repositoryColumns}
                initialSort={[{ id: "updatedDate", desc: true }]}
                rowActions={rowActions}
                searchableFields={["name"]}
                filters={filters}
                statusConfig={statusConfig}
                pageSize={10}
            />
        </div>
    );
}
