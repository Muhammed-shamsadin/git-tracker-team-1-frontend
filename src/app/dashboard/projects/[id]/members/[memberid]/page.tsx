"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { MemberHeader } from "@/features/projects/members/MemberHeader";
import { MemberStatsGrid } from "@/features/projects/members/MemberStatsGrid";
import { ContributionGraphPlaceholder } from "@/features/projects/members/ContributionGraphPlaceholder";
import { RecentActivitySummary } from "@/features/projects/members/RecentActivitySummary";
import { MemberCommitsTable } from "@/features/projects/members/MemberCommitsTable";
import { MemberRepositoriesTable } from "@/features/projects/members/MemberRepositoriesTable";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import MemberDetailsLoading from "@/features/projects/members/members-detail-skeleton";
import { RecentActivity } from "@/features/projects/recent-activity";
import { useMemberDetails } from "@/hooks/use-member-details";

export default function MemberDetailsPage() {
    const { id: projectId, memberid: memberId } = useParams();
    const { currentProject, fetchProjectById } = useProjectStore();
    const { memberData, repositories, isLoading, error, isDataReady, retry } =
        useMemberDetails({
            memberId: memberId as string,
            projectId: projectId as string,
        });

    // Fetch project data for navigation
    useEffect(() => {
        if (projectId) {
            fetchProjectById(projectId as string);
        }
    }, [projectId]);

    // Loading state
    if (isLoading && !isDataReady) {
        return <MemberDetailsLoading />;
    }

    // Error state with retry option
    if (error && !memberData) {
        return (
            <div className="mx-auto px-4 py-8 container">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/projects/${projectId}`}>
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to {currentProject?.name || "Project"}
                        </Link>
                    </Button>
                </div>

                <Alert variant="destructive" className="max-w-2xl">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="flex justify-between items-center">
                        <span>{error}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={retry}
                            className="ml-4"
                        >
                            <RefreshCw className="mr-2 w-4 h-4" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Not found state
    if (!isLoading && !memberData) {
        return (
            <div className="mx-auto px-4 py-8 container">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/projects/${projectId}`}>
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to {currentProject?.name || "Project"}
                        </Link>
                    </Button>
                </div>

                <div className="py-12 text-center">
                    <h2 className="mb-2 font-semibold text-muted-foreground text-2xl">
                        Member Not Found
                    </h2>
                    <p className="text-muted-foreground">
                        The requested member could not be found in this project.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mx-auto px-4 py-6 container">
            {/* Back Navigation */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/projects/${projectId}`}>
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to {currentProject?.name || "Project"}
                        </Link>
                    </Button>
                </div>

                {/* Refresh button for data reload */}
                <Button variant="outline" size="sm" onClick={retry}>
                    <RefreshCw className="mr-2 w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Error banner for partial data */}
            {error && memberData && (
                <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        Some data may be incomplete due to a loading error:{" "}
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Member Header */}
            {memberData && <MemberHeader member={memberData} />}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                    <TabsTrigger value="repositories">
                        Repositories ({repositories.length})
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {memberData && <MemberStatsGrid memberData={memberData} />}
                    <div className="gap-6 grid lg:grid-cols-2">
                        <ContributionGraphPlaceholder />
                        <RecentActivity
                            projectId={projectId as string}
                            developerId={memberId as string}
                            title="Recent Member Activity"
                            limit={5}
                            showRepository={true}
                            showDeveloper={false}
                        />
                    </div>
                </TabsContent>

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <MemberCommitsTable
                        projectId={projectId as string}
                        memberId={memberId as string}
                        title="Recent Member Commits"
                        limit={10}
                        showDescription={true}
                    />
                </TabsContent>

                {/* Repositories Tab */}
                <TabsContent value="repositories" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">
                                Member Repositories
                            </h3>
                            <div className="text-muted-foreground text-sm">
                                Total: {repositories.length} repositories
                            </div>
                        </div>

                        <MemberRepositoriesTable repositories={repositories} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
