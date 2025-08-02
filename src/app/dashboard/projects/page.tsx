"use client";

import { useState, useCallback, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { projectColomns } from "./columns";
import { Project } from "@/types/Project";
import type {
    StatusConfig,
    RowAction,
    FilterConfig,
} from "@/components/data-table/types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectStore";
import { ProjectCreateDialog } from "@/features/projects/project-create-dialog";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function Projects() {
    const router = useRouter();
    const { fetchClientsProjects, projects, isLoading, error, deleteProject } =
        useProjectStore();
    const [selectedRows, setSelectedRows] = useState<Project[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(
        null
    );

    // Fetch projects on mount
    useEffect(() => {
        fetchClientsProjects();
    }, [fetchClientsProjects]);

    const handleDeleteClick = (row: Project) => {
        setProjectToDelete(row);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete._id);
            toast.success(`Deleted project: ${projectToDelete.name}`);
            setProjectToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const rowActions: RowAction<Project>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View",
            onClick: (row) => {
                router.push(`/dashboard/projects/${row._id}`);
            },
        },
        {
            icon: <Edit className="w-4 h-4" />,
            label: "Edit",
            onClick: (row) => {
                toast.success(`Editing project: ${row.name}`);
            },
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: "Delete",
            variant: "destructive",
            onClick: handleDeleteClick,
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
    const handleRowSelectionChange = useCallback((rows: Project[]) => {
        setSelectedRows(rows);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and monitor all your development projects
                    </p>
                </div>
                <ProjectCreateDialog />
            </div>
            {/* Confirmation Dialog for Delete */}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Project"
                description={`Are you sure you want to delete the project "${projectToDelete?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                confirmText="Delete"
                variant="destructive"
            />
            {/* Loading/Error States */}
            {isLoading && (
                <div className="py-8 text-center">Loading projects...</div>
            )}
            {error && (
                <div className="py-4 text-red-500 text-center">{error}</div>
            )}
            {/* Data Table */}
            {!isLoading && !error && (
                <DataTable
                    data={projects}
                    columns={projectColomns}
                    rowActions={rowActions}
                    searchableFields={["name"]}
                    filters={filters}
                    statusConfig={statusConfig}
                    enableRowSelection={true}
                    onRowSelectionChange={handleRowSelectionChange}
                    pageSize={10}
                    rowIdAccessor="_id"
                    initialSort={[{ id: "updatedAt", desc: true }]}
                />
            )}
        </div>
    );
}
