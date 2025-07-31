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
import { mockProjects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCreateDialog } from "@/features/projects/project-create-dialog";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [selectedRows, setSelectedRows] = useState<Project[]>([]);

    const rowActions: RowAction<Project>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "View",
            onClick: (row) => {
                toast.success(`Viewing project: ${row.name}`);
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
            onClick: (row) => {
                setProjects((prev) =>
                    prev.filter((project) => project._id !== row._id)
                );
                toast.success(`Deleted project: ${row.name}`);
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
            {/* Data Table */}
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
            />
        </div>
    );
}
