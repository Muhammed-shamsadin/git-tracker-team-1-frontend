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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useRepositoryStore } from "@/stores/repositoryStore";
import Link from "next/link";
import { useAnalyticsStore } from "@/stores/analyticsStore";

// Colors for developer contributions slices
const devPalette = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"]; // 5 max

// Active projects will be derived from the backend list

export default function Dashboard() {
    const { user } = useAuthStore();
    const { projects, fetchAllProjects, isLoading } = useProjectStore();
    const { fetchProjectRepositories } = useRepositoryStore();
    const [repoCounts, setRepoCounts] = useState<Record<string, number>>({});
    const { generalStats, fetchKPIData, topContributors, effortDistribution, fetchGeneralAnalytics } = useAnalyticsStore();

    useEffect(() => {
        // Load projects for dashboard widgets
        fetchAllProjects();
    fetchKPIData(); // still used elsewhere; harmless
        fetchGeneralAnalytics();
    }, [fetchAllProjects, fetchKPIData, fetchGeneralAnalytics]);

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

    // Distinct theme-aware colors for donut slices (stable across renders)
    const effortPalette = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    const effortData = useMemo(() => {
        const items = effortDistribution ?? [];
        const hash = (s: string) => {
            let h = 0;
            for (let i = 0; i < s.length; i++) {
                h = ((h << 5) - h + s.charCodeAt(i)) | 0;
            }
            return h;
        };
        return items.map((s) => {
            const key = String(s.projectId ?? s.projectName ?? "");
            const idx = Math.abs(hash(key)) % effortPalette.length;
            return {
                name: s.projectName,
                value: s.percentage,
                commits: s.commits,
                color: effortPalette[idx],
            };
        });
    }, [effortDistribution]);

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
                    value={generalStats?.totalProjects ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<FolderOpen className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Active Projects"
                    value={generalStats?.activeProjects ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<FolderKanban className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Developers"
                    value={generalStats?.totalDevelopers ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<Database className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Commits"
                    value={generalStats?.totalCommits ?? 0}
                    change={{ value: 0, type: "increase" }}
                    icon={<GitCommit className="w-4 h-4 text-muted-foreground" />}
                />
            </div>

            {/* Row 2: Charts - Developer Contributions and Effort Distribution side by side */}
            <div className="grid gap-4 md:grid-cols-2">
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
                                    data={(topContributors ?? []).slice(0,5).map((c, idx) => ({
                                        name: c.name,
                                        commits: c.commits,
                                        color: devPalette[idx % devPalette.length],
                                    }))}
                                    dataKey="commits"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {(topContributors ?? []).slice(0,5).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={devPalette[index % devPalette.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Effort Distribution by Project</CardTitle>
                        <CardDescription>
                            Share of commits per project (donut)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <PieChart>
                                <Pie
                                    data={effortData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    label={({ name, value }) => `${name} ${Number(value).toFixed(0)}%`}
                                >
                                    {effortData.map((d, idx) => (
                                        <Cell key={`effort-${idx}`} fill={d.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(val: any, name: any, item: any) => {
                                                const commits = item?.payload?.commits ?? 0;
                                                return [
                                                    `${Number(val).toFixed(1)}%`,
                                                    `${name} — ${commits} commits`,
                                                ];
                                            }}
                                        />
                                    }
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

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
