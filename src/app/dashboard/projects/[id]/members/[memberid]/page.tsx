"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { MemberHeader } from "@/features/projects/members/MemberHeader";
import { MemberStatsGrid } from "@/features/projects/members/MemberStatsGrid";
import { ContributionGraphPlaceholder } from "@/features/projects/members/ContributionGraphPlaceholder";
import { RecentActivitySummary } from "@/features/projects/members/RecentActivitySummary";
import { MemberCommitsTable } from "@/features/projects/members/MemberCommitsTable";
import { ArrowLeft } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useMemberDetails } from "@/hooks/use-member-details";
import ListSkeleton from "@/components/skeletons/list-page-skeleton";

export default function MemberDetailsPage() {
    const { id: projectId, memberid: memberId } = useParams();
    console.log("Project ID:", projectId, "Member ID:", memberId);
    const { currentProject, fetchProjectById } = useProjectStore();
    const { memberData, transformedCommits, isLoading, error } =
        useMemberDetails({
            memberId: memberId as string,
            projectId: projectId as string,
        });

    // Fetch project data for navigation
    useEffect(() => {
        if (projectId) {
            fetchProjectById(projectId as string);
        }
    }, [projectId, fetchProjectById]);

    if (isLoading) {
        return <ListSkeleton />;
    }

    if (error) {
        return (
            <div className="py-8 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!memberData) {
        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground">Member not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${projectId}`}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to {currentProject?.name || "Project"}
                    </Link>
                </Button>
            </div>

            {/* Member Header */}
            <MemberHeader member={memberData} />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Recent Commits</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <MemberStatsGrid memberData={memberData} />
                    <div className="gap-6 grid md:grid-cols-2">
                        <ContributionGraphPlaceholder />
                        <RecentActivitySummary />
                    </div>
                </TabsContent>

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <MemberCommitsTable
                        memberCommits={transformedCommits}
                        memberName={memberData.name}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
