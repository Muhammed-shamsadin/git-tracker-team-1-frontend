"use client";

import React, { useEffect, useState } from "react";
import { StatsCard } from "@/components/cards/stats-card";
import { FolderGit2, FolderOpen, GitCommit, Database } from "lucide-react";
import CommitTrendsChart from "@/features/analytics/CommitTrendsChart";
import ContributorsLeaderboard from "@/features/analytics/ContributorsLeaderboard";
import { useAnalyticsStore } from "@/stores/analyticsStore";
import { useProjectStore } from "@/stores/projectStore";
import { useRepositoryStore } from "@/stores/repositoryStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
    const { 
        kpiData, 
        isLoading, 
        error, 
        selectedProjectId,
        selectedRepositoryId,
        projectCommitData,
        repositoryCommitData,
        projectContributors,
        repositoryContributors,
        fetchKPIData,
        fetchProjectAnalytics,
        fetchRepositoryAnalytics,
        setSelectedProject,
        setSelectedRepository
    } = useAnalyticsStore();

    // Use centralized stores for projects & repositories lists
    const { projects: allProjects, fetchAllProjects } = useProjectStore();
    const { repositories: allRepositories, fetchAllRepositories } = useRepositoryStore();

    // Fetch initial data on component mount
    useEffect(() => {
        fetchKPIData();
        // Fetch dropdown data from dedicated stores
        fetchAllProjects();
        fetchAllRepositories();
    }, [fetchKPIData, fetchAllProjects, fetchAllRepositories]);

    // Local state for project & repository time ranges
    const [projectTimeRange, setProjectTimeRange] = useState<"week" | "month" | "year">("week");
    const [repositoryTimeRange, setRepositoryTimeRange] = useState<"week" | "month" | "year">("week");

    // Fetch project analytics when project or time range changes
    useEffect(() => {
        if (selectedProjectId) {
            fetchProjectAnalytics(selectedProjectId, projectTimeRange);
        }
    }, [selectedProjectId, projectTimeRange, fetchProjectAnalytics]);

    // Fetch repository analytics when repository or time range changes
    useEffect(() => {
        if (selectedRepositoryId) {
        fetchRepositoryAnalytics(selectedRepositoryId, repositoryTimeRange);
        }
    }, [selectedRepositoryId, repositoryTimeRange, fetchRepositoryAnalytics]);

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
    const getProjectId = (p: any) => (p?.id ?? p?._id) as string | undefined;
    const getRepoId = (r: any) => (r?.id ?? r?._id) as string | undefined;
    const projectsList = Array.isArray(allProjects)
        ? allProjects
        : ((allProjects as any)?.projects ?? []);
    const repositoriesList = Array.isArray(allRepositories)
        ? allRepositories
        : ((allRepositories as any)?.repositories ?? []);

    const selectedProject = projectsList.find((p: any) => getProjectId(p) === selectedProjectId);
    const selectedRepository = repositoriesList.find((r: any) => getRepoId(r) === selectedRepositoryId);

    // Contributors leaderboard now fetches independently; no coupled data here

    // Auto-select defaults: if no project/repo selected, pick the first available item
    useEffect(() => {
        if (!selectedProjectId) {
            const firstProjectId = (projectsList as any[])
                .map((p: any) => getProjectId(p))
                .find((id: any) => !!id);
            if (firstProjectId) {
                setSelectedProject(firstProjectId as string);
            }
        }
    }, [selectedProjectId, projectsList, setSelectedProject]);

    useEffect(() => {
        if (!selectedRepositoryId) {
            const firstRepoId = (repositoriesList as any[])
                .map((r: any) => getRepoId(r))
                .find((id: any) => !!id);
            if (firstRepoId) {
                setSelectedRepository(firstRepoId as string);
            }
        }
    }, [selectedRepositoryId, repositoriesList, setSelectedRepository]);

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

            {/* Row 2: Commit Trends (stacked) */}
            <div className="grid grid-cols-1 gap-4">
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
                            onValueChange={(value) => {
                                const newVal = value === "none" ? null : value;
                                console.log("Project selected:", newVal);
                                setSelectedProject(newVal);
                            }}
                        >
                                <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="none">Select Projects</SelectItem> */}
                                {(projectsList as any[])
                                    .map((project: any) => ({ id: getProjectId(project), name: (project as any).name }))
                                    .filter((p: any) => !!p.id)
                                    .map((p: any) => (
                                        <SelectItem key={p.id!} value={p.id!}>
                                            {p.name}
                                        </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <CommitTrendsChart
                        title=""
                        description=""
                        data={projectCommitData || []}
                        timeRange={projectTimeRange}
                        onTimeRangeChange={(r) => setProjectTimeRange(r)}
                        showTimeRangeTabs
                        key={`proj-${selectedProjectId || 'none'}-${projectTimeRange}`}
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
                            onValueChange={(value) => {
                                const newVal = value === "none" ? null : value;
                                console.log("Repository selected:", newVal);
                                setSelectedRepository(newVal);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Repository" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="none">All Repositories</SelectItem> */}
                                {(repositoriesList as any[])
                                    .map((repository: any) => ({ id: getRepoId(repository), name: (repository as any).name }))
                                    .filter((r: any) => !!r.id)
                                    .map((r: any) => (
                                        <SelectItem key={r.id!} value={r.id!}>
                                            {r.name}
                                        </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <CommitTrendsChart
                        title=""
                        description=""
                        data={repositoryCommitData || []}
                        timeRange={repositoryTimeRange}
                        onTimeRangeChange={(r) => setRepositoryTimeRange(r)}
                        showTimeRangeTabs
                        key={`repo-${selectedRepositoryId || 'none'}-${repositoryTimeRange}`}
                    />
                </div>
            </div>

            {/* Row 3: Contributors */}
            <ContributorsLeaderboard
                title="Top Contributors"
                description="Most active contributors"
                projects={projectsList as any}
                repositories={repositoriesList as any}
            />
        </div>
    );
}
