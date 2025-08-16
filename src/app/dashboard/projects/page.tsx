"use client";

import { useState, useCallback } from "react";
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
import { useAuthStore } from "@/stores/authStore";
import {
    useRoleBasedProjects,
    useProjectPermissions,
} from "@/hooks/use-projects";

export default function Projects() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { deleteProject } = useProjectStore();

    // Use the new role-based hook for automatic project fetching
    const { projects, isLoading, error, userRole } = useRoleBasedProjects();

    const [selectedRows, setSelectedRows] = useState<Project[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(
        null
    );

    const handleDeleteClick = (row: Project) => {
        setProjectToDelete(row);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (projectToDelete) {
            const success = await deleteProject(projectToDelete._id);
            if (success) {
                toast.success(`Deleted project: ${projectToDelete.name}`);
            } else {
                toast.error("Failed to delete project");
            }
            setProjectToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    // Helper function to check permissions
    const canEditProject = (project: Project) => {
        if (!user) return false;
        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;
        return false;
    };

    const canDeleteProject = (project: Project) => {
        if (!user) return false;
        if (user.userType === "superadmin") return true;
        if (user.userType === "client" && project.clientId === user._id)
            return true;
        return false;
    };

    // Create row actions based on permissions
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
                // TODO: Open edit dialog or navigate to edit page
            },
            visible: (row) => canEditProject(row),
        },
        {
            icon: <Trash2 className="w-4 h-4" />,
            label: "Delete",
            variant: "destructive",
            onClick: handleDeleteClick,
            visible: (row) => canDeleteProject(row),
        },
    ];

    const statusConfig: StatusConfig = {
        active: { icon: "🟢", label: "Active", color: "green" },
        archived: { icon: "🗃️", label: "Archived", color: "gray" },
        completed: { icon: "🏁", label: "Completed", color: "blue" },
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

    // Show create button only for clients and superadmins
    const canCreateProject =
        user && (user.userType === "client" || user.userType === "superadmin");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.userType === "superadmin" &&
                            "Manage and monitor all development projects"}
                        {user?.userType === "client" &&
                            "Manage and monitor your projects"}
                        {user?.userType === "developer" &&
                            "View projects you're assigned to"}
                    </p>
                </div>
                {canCreateProject && <ProjectCreateDialog />}
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
                    enableRowSelection={user?.userType === "superadmin"} // Only superadmins can bulk select
                    onRowSelectionChange={handleRowSelectionChange}
                    pageSize={10}
                    rowIdAccessor="_id"
                    initialSort={[{ id: "updatedAt", desc: true }]}
                />
            )}
        </div>
    );
}
