"use client";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity } from "lucide-react";
import { ProjectDetail } from "@/types/Project";
import { timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { ProjectSettingsDialog } from "./project-settings-dialog";
export function ProjectHeader({ project }: { project: ProjectDetail }) {
    const { user } = useAuthStore();
    return (
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-3xl tracking-tight">
                        {project.name}
                    </h1>
                    <Badge
                        variant={
                            project.status === "active"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {project.status}
                    </Badge>
                </div>
                {project.description && (
                    <p className="max-w-2xl text-muted-foreground">
                        {project.description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        Updated {timeAgo(new Date(project.updatedAt))}
                    </div>
                </div>
                {project.tags && project.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
            {(user?.userType === "superadmin" ||
                (user?.userType === "client" &&
                    user?._id === project.clientId)) && (
                <ProjectSettingsDialog />
            )}
        </div>
    );
}
