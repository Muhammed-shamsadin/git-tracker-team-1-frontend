"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRepositoryStore } from "@/stores/repositoryStore";
import { RepositoryHeader } from "@/features/repositories/RepositoryHeader";
import { RepositoryStatsGrid } from "@/features/repositories/RepositoryStatsGrid";
import { CommitTrendsChart } from "@/features/analytics/CommitTrendsChart";
import { RepositoryInfoCard } from "@/features/repositories/RepositoryInfoCard";
import { CommitsTable } from "@/features/repositories/CommitsTable";
import { RecentActivity } from "@/features/projects/recent-activity";
import RepositoryDetailsLoading from "@/features/repositories/repository-details-skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyticsStore } from "@/stores/analyticsStore";

export default function RepositoryDetailsPage() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const {
        currentRepository,
        fetchRepositoryById,
        fetchRepositoryCommits,
        isLoading,
        error,
    } = useRepositoryStore();
    const { repositoryCommitData, fetchRepositoryAnalytics } = useAnalyticsStore();

    const [commits, setCommits] = useState<any[]>([]);
    const [commitsLoading, setCommitsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchRepositoryById(id as string);
        }
    }, [id, fetchRepositoryById]);
    // Fetch 30-day repository analytics for the chart
    useEffect(() => {
        if (id) {
            fetchRepositoryAnalytics(id as string, "month");
        }
    }, [id, fetchRepositoryAnalytics]);

    // Fetch commits when repository is loaded
    useEffect(() => {
        if (currentRepository?._id) {
            setCommitsLoading(true);
            fetchRepositoryCommits(currentRepository._id)
                .then((commitsData) => {
                    setCommits(commitsData);
                    setCommitsLoading(false);
                })
                .catch(() => {
                    setCommitsLoading(false);
                });
        }
    }, [currentRepository, fetchRepositoryCommits]);

    if (isLoading || !currentRepository) {
        return <RepositoryDetailsLoading />;
    }

    if (error) {
        return <div className="p-8 text-destructive text-center">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <RepositoryHeader repository={currentRepository} />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="commits">Commits</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <RepositoryStatsGrid repository={currentRepository} />
                    <div className="gap-6 grid md:grid-cols-2">
                        <CommitTrendsChart
                            title="Commit Activity"
                            description="Commits over the last 30 days"
                            data={repositoryCommitData || []}
                            timeRange="month"
                            showTimeRangeTabs={false}
                        />
                        <RecentActivity
                            repositoryId={currentRepository._id}
                            title="Recent Repository Activity"
                            limit={6}
                            showRepository={false}
                            showDeveloper={true}
                        />
                    </div>
                    <RepositoryInfoCard repository={currentRepository} />
                </TabsContent>

                {/* Commits Tab */}
                <TabsContent value="commits" className="space-y-6">
                    <CommitsTable
                        commits={commits}
                        isLoading={commitsLoading}
                        repositoryId={id as string}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
