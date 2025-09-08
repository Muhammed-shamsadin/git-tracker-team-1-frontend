"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { ProjectHeader } from "@/features/projects/ProjectHeader";
import { ProjectStatsGrid } from "@/features/projects/ProjectStatsGrid";
import {
    ActivityItem,
    RecentActivityList,
} from "@/features/projects/RecentActivityList";
import { CommitGraphPlaceholder } from "@/features/projects/CommitGraphPlaceholder";
import { RepositoriesTable } from "@/features/projects/RepositoriesTable";
import { MembersTable } from "@/features/projects/MembersTable";
import { useAuthStore } from "@/stores/authStore";
import { useProjectPermissions } from "@/hooks/use-projects";
import ProjectDetailsLoading from "@/features/projects/project-details-skeleton";
import { AddDeveloperDialog } from "@/features/projects/add-developer-dialog";
import { timeAgo } from "@/lib/utils";

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const { currentProject, fetchProjectById, isLoading, error } =
        useProjectStore();
    const { canManageMembers, isMember } =
        useProjectPermissions(currentProject);

    useEffect(() => {
        if (id) fetchProjectById(id as string);
    }, [id, fetchProjectById, user?.userType]);

    if (isLoading || !currentProject) {
        return (
            <div className="p-8 text-muted-foreground text-center">
                <ProjectDetailsLoading />
            </div>
        );
    }
    if (error) {
        return <div className="p-8 text-destructive text-center">{error}</div>;
    }

    // TODO: Replace with real activity data from API if available
    const dummyActivityItems: ActivityItem[] = [
        {
            id: 1,
            type: "commit",
            message: "Fix: resolve null pointer in auth flow",
            author: "Alice Johnson",
            repository: "auth-service",
            timestamp: timeAgo(
                new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
            ),
            avatar: "https://i.pravatar.cc/40?img=1",
        },
        {
            id: 2,
            type: "issue",
            message: "UI: dashboard charts not rendering on mobile",
            author: "Bob Smith",
            repository: "web-client",
            timestamp: timeAgo(
                new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
            ),
            avatar: "https://i.pravatar.cc/40?img=2",
        },
        {
            id: 3,
            type: "merge",
            message: "Merge: feature/login -> main",
            author: "Carol Peters",
            repository: "auth-service",
            timestamp: timeAgo(
                new Date(Date.now() - 1000 * 60 * 30).toISOString()
            ),
            avatar: "https://i.pravatar.cc/40?img=3",
        },
        {
            id: 4,
            type: "comment",
            message: "Comment: left feedback on PR #42",
            author: "Dave Lee",
            repository: "api",
            timestamp: timeAgo(
                new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
            ),
            avatar: "https://i.pravatar.cc/40?img=5",
        },
    ];

    return (
        <div className="space-y-6">
            <ProjectHeader project={currentProject} />
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <ProjectStatsGrid project={currentProject} />
                    <div className="gap-6 grid md:grid-cols-2">
                        <CommitGraphPlaceholder />
                        <RecentActivityList activities={dummyActivityItems} />
                    </div>
                </TabsContent>
                <TabsContent value="repositories" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-lg">
                                Project Repositories
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Manage repositories associated with this project
                            </p>
                        </div>
                        {isMember && (
                            <Button>
                                <Plus className="mr-2 w-4 h-4" />
                                Add Repository
                            </Button>
                        )}
                    </div>
                    <RepositoriesTable
                        repositories={currentProject.repositories}
                    />
                </TabsContent>
                <TabsContent value="members" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-lg">
                                Project Members
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Manage team members and their roles
                            </p>
                        </div>
                        {canManageMembers && (
                            <AddDeveloperDialog
                                projectId={currentProject?._id}
                            />
                        )}
                    </div>
                    <MembersTable
                        members={currentProject.members}
                        projectId={currentProject._id}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
