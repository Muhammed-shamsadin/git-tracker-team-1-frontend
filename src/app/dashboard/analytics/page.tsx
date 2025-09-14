"use client";

import React, { useEffect } from "react";
import { StatsCard } from "@/components/cards/stats-card";
import { FolderGit2, FolderOpen, GitCommit, Database } from "lucide-react";
import CommitTrendsChart from "@/features/analytics/CommitTrendsChart";
import ContributorsLeaderboard from "@/features/analytics/ContributorsLeaderboard";
import { useAnalyticsStore } from "@/stores/analyticsStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
    const { 
        kpiData, 
        isLoading, 
        error, 
        projects,
        repositories,
        selectedProjectId,
        selectedRepositoryId,
        projectCommitData,
        repositoryCommitData,
        projectContributors,
        repositoryContributors,
        fetchKPIData,
        fetchProjects,
        fetchRepositories,
        fetchProjectAnalytics,
        fetchRepositoryAnalytics,
        setSelectedProject,
        setSelectedRepository
    } = useAnalyticsStore();

    // Fetch initial data on component mount
    useEffect(() => {
        fetchKPIData();
        fetchProjects();
    }, [fetchKPIData, fetchProjects]);

    // Fetch project analytics when project is selected
    useEffect(() => {
        if (selectedProjectId) {
            fetchProjectAnalytics(selectedProjectId);
        }
    }, [selectedProjectId, fetchProjectAnalytics]);

    // Fetch repository analytics when repository is selected
    useEffect(() => {
        if (selectedRepositoryId) {
            fetchRepositoryAnalytics(selectedRepositoryId);
        }
    }, [selectedRepositoryId, fetchRepositoryAnalytics]);

    // KPI cards configuration
    const kpis = [
        {
            title: "Total Projects",
            value: kpiData?.totalProjects || 0,
            change: { value: 12.5, type: "increase" },
            icon: <FolderOpen className="w-4 h-4 text-muted-foreground" />,
        },
        {
            title: "Active Projects",
            value: kpiData?.activeProjects || 0,
            change: { value: 2.1, type: "decrease" },
            icon: <FolderGit2 className="w-4 h-4 text-muted-foreground" />,
        },
        {
            title: "Total Repositories",
            value: kpiData?.totalRepositories || 0,
            change: { value: 8.3, type: "increase" },
            icon: <Database className="w-4 h-4 text-muted-foreground" />,
        },
        {
            title: "Total Commits",
            value: kpiData?.totalCommits || 0,
            change: { value: 12.5, type: "increase" },
            icon: <GitCommit className="w-4 h-4 text-muted-foreground" />,
        },
    ];

    // Get selected project and repository names for display
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const selectedRepository = repositories.find(r => r.id === selectedRepositoryId);

    // Use real contributor data from API or fallback to empty array
    const contributors = projectContributors || repositoryContributors || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-bold text-3xl">Analytics</h1>
                <p className="text-muted-foreground">Track your development metrics and team performance</p>
            </div>

            {/* Row 1: KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, idx) => (
                    <StatsCard
                        key={idx}
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change as any}
                        icon={kpi.icon}
                    />
                ))}
            </div>

            {/* Row 2: Commit Trends */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Project Commit Activity</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedProject ? `Commits for ${selectedProject.name}` : "Select a project to view commit activity"}
                            </p>
                        </div>
                        <Select
                            value={selectedProjectId || "none"}
                            onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">All Projects</SelectItem>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <CommitTrendsChart
                        title=""
                        description=""
                        data={projectCommitData || []}
                        timeRange="week"
                        onTimeRangeChange={() => {}} // Disabled as requested
                    />
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Repository Commit Activity</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedRepository ? `Commits for ${selectedRepository.name}` : "Select a repository to view commit activity"}
                            </p>
                        </div>
                        <Select
                            value={selectedRepositoryId || "none"}
                            onValueChange={(value) => setSelectedRepository(value === "none" ? null : value)}
                            disabled={!selectedProjectId}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Repository" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">All Repositories</SelectItem>
                                {repositories.map((repository) => (
                                    <SelectItem key={repository.id} value={repository.id}>
                                        {repository.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <CommitTrendsChart
                        title=""
                        description=""
                        data={repositoryCommitData || []}
                        timeRange="week"
                        onTimeRangeChange={() => {}} // Disabled as requested
                    />
                </div>
            </div>

            {/* Row 3: Contributors */}
            <ContributorsLeaderboard
                title="Top Contributors"
                description={selectedProject ? `Contributors for ${selectedProject.name}` : selectedRepository ? `Contributors for ${selectedRepository.name}` : "Select a project or repository to view contributors"}
                data={contributors.map((c, i) => ({ 
                    id: c.user_id, 
                    name: c.name, 
                    email: c.email, 
                    commits: c.commits,
                    projectId: selectedProjectId || "unknown", 
                    repositoryId: selectedRepositoryId || "unknown" 
                }))}
                projects={projects}
                repositories={repositories}
            />
        </div>
    );
}
