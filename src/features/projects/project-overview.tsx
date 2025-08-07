"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectStats } from "./project-stats";
import { RecentActivity } from "./recent-activity";
import { ProjectHealth } from "./project_health";
import { ProjectSettingsDialog } from "./project-settings-dialog";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";

export function ProjectOverview() {
    const projectId = useParams().id as string;
    const router = useRouter();
    const { user } = useAuthStore();
    const {
        currentProject,
        fetchProjectById,
        isLoading,
        error,
        clearCurrentProject,
    } = useProjectStore();

    useEffect(() => {
        if (projectId) {
            fetchProjectById(projectId);
        }
        return () => clearCurrentProject();
    }, [projectId, fetchProjectById, clearCurrentProject]);

    if (isLoading) {
        return <ProjectOverviewSkeleton />;
    }

    if (error) {
        return (
            <div className="bg-destructive/5 p-4 border border-destructive/20 rounded-lg text-destructive">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-medium">Failed to load project</h3>
                </div>
                <p className="mt-2 text-sm">{error}</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => fetchProjectById(projectId)}
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!currentProject) {
        return <div>Project not found.</div>;
    }

    const { name, description, status } = currentProject;

    return (
        <div className="space-y-6">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
                <div className="flex items-start gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-2xl tracking-tight">
                                {name}
                            </h1>
                            <Badge
                                variant={
                                    status === "active"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {status}
                            </Badge>
                        </div>
                        {description && (
                            <p className="mt-1 text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {user?.userType &&
                    ["client", "superadmin"].includes(user.userType) && (
                        <ProjectSettingsDialog project={currentProject} />
                    )}
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 pt-6">
                    <ProjectStats {...currentProject} />
                    <div className="gap-6 grid md:grid-cols-2">
                        <ProjectHealth />
                        <RecentActivity />
                    </div>
                </TabsContent>
                <TabsContent value="repositories" className="pt-6">
                    {/* <RepositoriesPage /> */}
                    <h1>repo tab</h1>
                </TabsContent>
                <TabsContent value="team" className="pt-6">
                    <h1>team tab</h1>
                    {/* <TeamPage project={currentProject} /> */}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export function ProjectOverviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="space-y-2">
                    <Skeleton className="w-48 h-6" />
                    <Skeleton className="w-64 h-4" />
                </div>
            </div>
            <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="rounded-lg h-24" />
                ))}
            </div>
            <div className="gap-6 grid md:grid-cols-2">
                <Skeleton className="rounded-lg h-64" />
                <Skeleton className="rounded-lg h-64" />
            </div>
        </div>
    );
}
