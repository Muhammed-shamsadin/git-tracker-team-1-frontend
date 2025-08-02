"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStats } from "./project-stats";
import { RecentActivity } from "./recent-activity";
import { ProjectHealth } from "./project_health";
import RepositoriesPage from "../../components/layout/repositories";
import TeamPage from "../../components/layout/team";
import { ProjectSettingsDialog } from "@/features/projects/project-settings-dialog";
import { useProjectStore } from "@/stores/projectStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
export function ProjectOverview() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
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
        return () => {
            clearCurrentProject();
        };
    }, [projectId, fetchProjectById, clearCurrentProject]);

    if (isLoading) {
        return <div>Loading project details...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!currentProject) {
        return <div>Project not found.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-2xl">
                                {currentProject.name}
                            </h1>
                            <Badge variant="secondary">
                                {currentProject.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            {currentProject.description}
                        </p>
                    </div>
                </div>
                <ProjectSettingsDialog project={currentProject} />
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <ProjectStats />
                    <ProjectHealth />
                    <RecentActivity />
                </TabsContent>
                <TabsContent value="repositories" className="space-y-4">
                    <RepositoriesPage />
                </TabsContent>
                <TabsContent value="team" className="space-y-4">
                    <TeamPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}
