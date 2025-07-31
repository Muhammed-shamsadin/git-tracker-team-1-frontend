"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStats } from "./project-stats";
import { RecentActivity } from "./recent-activity";
import { ProjectHealth } from "./project_health";
import RepositoriesPage from "./repositories";
import TeamPage from "./team";
import { ProjectSettingsDialog } from "@/features/projects/project-settings-dialog";
import { mockProjects } from "@/data/projects";
import { useParams } from "next/navigation";
export function ProjectOverview() {
    // TODO: Replace with actual project fetching logic
    // For now, we will use a mock project from the mockProjects array
    const projectId = useParams();
    const project = mockProjects.find((p) => p._id === projectId._id);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-2xl">
                                Web Application
                            </h1>
                            <Badge variant="secondary">active</Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Main customer-facing web application built with
                            React and Next.js
                        </p>
                    </div>
                </div>
                {project && <ProjectSettingsDialog project={project} />}
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    {/* Render project stats, activity, and recent activity components */}
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
