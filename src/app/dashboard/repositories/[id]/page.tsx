"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRepositoryStore } from "@/stores/repositoryStore";
import { RepositoryHeader } from "@/features/repositories/RepositoryHeader";
import { RepositoryStatsGrid } from "@/features/repositories/RepositoryStatsGrid";
import { CommitActivityChart } from "@/features/repositories/CommitActivityChart";
import { RepositoryInfoCard } from "@/features/repositories/RepositoryInfoCard";
import { CommitsTable } from "@/features/repositories/CommitsTable";
import RepositoryDetailsLoading from "@/features/repositories/repository-details-skeleton";
import { useAuthStore } from "@/stores/authStore";

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

    const [commits, setCommits] = useState<any[]>([]);
    const [commitsLoading, setCommitsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchRepositoryById(id as string);
        }
    }, [id, fetchRepositoryById]);

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
                        <CommitActivityChart repository={currentRepository} />
                        <RepositoryInfoCard repository={currentRepository} />
                    </div>
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
