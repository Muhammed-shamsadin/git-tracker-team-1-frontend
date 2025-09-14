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

// Mock data for pie chart - developer contributions
const developerContributions = [
    { name: "Alice Johnson", commits: 45, color: "#8884d8" },
    { name: "Bob Smith", commits: 32, color: "#82ca9d" },
    { name: "Carol Davis", commits: 28, color: "#ffc658" },
    { name: "David Wilson", commits: 18, color: "#ff7c7c" },
    { name: "Eva Brown", commits: 12, color: "#8dd1e1" },
];

const activeProjects = [
    {
        id: "1",
        name: "Git Tracker",
        description: "Track local git repositories and developer progress",
        status: "active",
        repositories: 3,
        members: 5,
    },
    {
        id: "2", 
        name: "E-commerce Platform",
        description: "Modern e-commerce solution with React and Node.js",
        status: "active",
        repositories: 2,
        members: 3,
    },
];


const stats = [
    {
        title: "Total Projects",
        value: 2,
        change: { value: 12.5, type: "increase" },
        icon: <FolderOpen className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Active Projects",
        value: 2,
        change: { value: 2.1, type: "decrease" },
        icon: <FolderKanban className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Total Repositories",
        value: 5,
        change: { value: 8.3, type: "increase" },
        icon: <Database className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Total Commits",
        value: 34,
        change: { value: 12.5, type: "increase" },
        icon: <GitCommit className="w-4 h-4 text-muted-foreground" />,
    },
];

export default function Dashboard() {
    const { user } = useAuthStore();
    
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
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                    />
                ))}
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
                                    <span className="text-xs text-muted-foreground">
                                        {project.repositories} repositories • {project.members} members
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                View Project
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
