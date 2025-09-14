"use client";

import {
    FolderKanban,
    FolderOpen,
    Database,
    GitCommit,
} from "lucide-react";
import { StatsCard } from "@/components/cards/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuickActionsMenu } from "@/features/dashboard/components/quick-action-menu";
import { useAuthStore } from "@/stores/authStore";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useRepositoryStore } from "@/stores/repositoryStore";
import Link from "next/link";
import { useAnalyticsStore } from "@/stores/analyticsStore";

// Mock data for pie chart - developer contributions
const developerContributions = [
    { name: "Alice Johnson", commits: 45, color: "#8884d8" },
    { name: "Bob Smith", commits: 32, color: "#82ca9d" },
    { name: "Carol Davis", commits: 28, color: "#ffc658" },
    { name: "David Wilson", commits: 18, color: "#ff7c7c" },
    { name: "Eva Brown", commits: 12, color: "#8dd1e1" },
];

// Active projects will be derived from the backend list

export default function Dashboard() {
    const { user } = useAuthStore();
    const { projects, fetchAllProjects, isLoading } = useProjectStore();
    const { fetchProjectRepositories } = useRepositoryStore();
    const [repoCounts, setRepoCounts] = useState<Record<string, number>>({});
    const { kpiData, fetchKPIData } = useAnalyticsStore();

    useEffect(() => {
        // Load projects for dashboard widgets
        fetchAllProjects();
        fetchKPIData();
    }, [fetchAllProjects, fetchKPIData]);

    // Normalize and filter for active projects
    const activeProjects = useMemo(() => {
        return (projects || [])
            .map((p: any) => {
                const id = (p.id ?? p._id) as string;
                return {
                    id,
                    name: p.name ?? p.title ?? "Unnamed Project",
                    description: p.description ?? "",
                    status: p.status ?? (p.isActive ? "active" : "archived"),
                    // Use fetched counts if available, else fallback to provided values/arrays
                    // repositories:
                    //     repoCounts[id] ?? p.repositoriesCount ?? p.repositories?.length ?? 0,
                    commits: p.commitsCount ?? p.projectCommits?.length ?? 0,
                    members: p.membersCount ?? p.projectDevelopers?.length ?? 0,
                };
            })
            .filter((p) => p.status?.toLowerCase() === "active");
    }, [projects, repoCounts]);

    // Fetch per-project repository counts for active projects
    useEffect(() => {
        const loadRepoCounts = async () => {
            const entries = await Promise.all(
                (projects || [])
                    .filter((p: any) => (p.status ?? (p.isActive ? "active" : "archived")).toLowerCase() === "active")
                    .map(async (p: any) => {
                        const projectId = (p.id ?? p._id) as string;
                        if (!projectId) return null;
                        try {
                            const repos = await fetchProjectRepositories(projectId);
                            const count = Array.isArray(repos) ? repos.length : 0;
                            return [projectId, count] as [string, number];
                        } catch {
                            return [projectId, 0] as [string, number];
                        }
                    })
            );
            const map: Record<string, number> = {};
            for (const entry of entries) {
                if (!entry) continue;
                const [id, count] = entry;
                map[id] = count;
            }
            setRepoCounts(map);
        };
        if ((projects || []).length > 0) {
            loadRepoCounts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects, fetchProjectRepositories]);
    
    // Chart configuration for pie chart
    const chartConfig = {
        commits: {
            label: "Commits",
        },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back,{" "}
                        <span className="font-bold text-foreground">
                            {`${user?.fullName.split(" ")[0]} ! `}
                        </span>
                        Here's what's happening with your projects.
                    </p>
                </div>
                <QuickActionsMenu />
            </div>

            {/* Row 1: KPI Cards */}
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Projects"
                    value={kpiData?.totalProjects ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<FolderOpen className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Active Projects"
                    value={kpiData?.activeProjects ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<FolderKanban className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Repositories"
                    value={kpiData?.totalRepositories ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<Database className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Commits"
                    value={kpiData?.totalCommits ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<GitCommit className="w-4 h-4 text-muted-foreground" />}
                />
            </div>

            {/* Row 2: Developer Contributions Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Developer Contributions</CardTitle>
                    <CardDescription>
                        Distribution of commits by team members
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                        <PieChart>
                            <Pie
                                data={developerContributions}
                                dataKey="commits"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {developerContributions.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Row 3: Active Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Your most recently updated projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && (
                        <div className="text-sm text-muted-foreground">Loading projects…</div>
                    )}
                    {!isLoading && activeProjects.length === 0 && (
                        <div className="text-sm text-muted-foreground">No active projects yet.</div>
                    )}
                    {activeProjects.map((project) => (
                        <div
                            key={project.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {project.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {project.status}
                                    </Badge>
                                    {/* // commitsCount */}
                                    <span className="text-xs text-muted-foreground">
                                        {project.commits} commits • {project.members} members
                                    </span>
                                    {/* <span className="text-xs text-muted-foreground">
                                        {(repoCounts[project.id as string] ?? project.repositories) || 0} repositories • {project.members} members
                                    </span> */}
                                </div>
                            </div>
                            <Link href={`/dashboard/projects/${project.id}`}>
                                <Button variant="outline" size="sm">View Project</Button>
                            </Link>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
