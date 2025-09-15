"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios";

export interface ContributorRow {
    id: string;
    name: string;
    email?: string;
    commits: number;
}

interface ContributorsLeaderboardProps {
    title?: string;
    description?: string;
    projects?: Array<{ id: string; name: string }>;
    repositories?: Array<{ id: string; name: string }>; // This line is kept for context
}

export function ContributorsLeaderboard({
    title = "Top Contributors",
    description = "Most active contributors",
    projects = [],
    repositories = [],
}: ContributorsLeaderboardProps) {
    const getId = (o: any) => {
        const v = o?.id ?? o?._id;
        return typeof v === "string" || typeof v === "number" ? String(v) : "";
    };
    const [selectedProject, setSelectedProject] = useState<string>("none");
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
    const [contributors, setContributors] = useState<ContributorRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize dropdowns when lists change (keep as 'none' if empty)
    useEffect(() => {
        if (projects.length && selectedProject === "none") {
            // leave as 'none' to allow global fetch unless user selects
        }
    }, [projects, selectedProject]);
    // No repository filter anymore

    // Fetch contributors whenever filters change
    useEffect(() => {
        const controller = new AbortController();
        const fetchContributors = async () => {
            setLoading(true);
            setError(null);
            try {
                const projectId = selectedProject !== "none" ? selectedProject : undefined;
                const res = await api.get(`/analytics/top-contributors`, {
                    params: {
                        projectId,
                        timeRange,
                        range: timeRange,
                        time_range: timeRange,
                    },
                    signal: controller.signal,
                });
                const payload = res.data?.data ?? res.data;
                const raw: any[] = Array.isArray(payload?.top_contributors)
                    ? payload.top_contributors
                    : Array.isArray(payload?.topContributors)
                        ? payload.topContributors
                        : [];
                const items: ContributorRow[] = raw.slice(0, 10).map((c: any) => ({
                    id: String(c.user_id ?? c.id ?? ""),
                    name: (c.name ?? c.fullName ?? c.username ?? "Unknown").toString(),
                    email: c.email ?? "",
                    commits: Number(c.commits ?? c.count ?? 0),
                }));
                setContributors(items);
            } catch (err: any) {
                if (err?.name !== "CanceledError") {
                    setError(err?.response?.data?.message || err?.message || "Failed to load contributors");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchContributors();
        return () => controller.abort();
    }, [selectedProject, timeRange]);

    const rankedData = useMemo(() => {
        const total = contributors.reduce((sum, r) => sum + r.commits, 0) || 1;
        const sorted = [...contributors].sort((a, b) => b.commits - a.commits);
        return sorted.map((row, idx) => ({
            ...row,
            rank: idx + 1,
            percent: Math.round((row.commits / total) * 1000) / 10,
        }));
    }, [contributors]);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "rank",
            header: "Rank",
            cell: ({ row }) => <span className="font-mono">#{row.original.rank}</span>,
        },
        {
            id: "user",
            header: "Name",
            cell: ({ row }) => {
                const name = row.original.name || "Unknown";
                const initials = name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "commits",
            header: "Commits",
            cell: ({ row }) => (
                <span className="font-mono">
                    {row.original.commits.toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "percent",
            header: "% of Total",
            cell: ({ row }) => <span className="font-mono">{row.original.percent}%</span>,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select value={selectedProject} onValueChange={(v) => { setSelectedProject(v); }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">All Projects</SelectItem>
                                {projects
                                    .map((p, idx) => ({ key: getId(p) || `project-${idx}`, id: getId(p), name: (p as any).name }))
                                    .filter((p) => !!p.id)
                                    .map((p) => (
                                        <SelectItem key={p.key} value={p.id}>{p.name}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                            <TabsList>
                                <TabsTrigger value="week">Week</TabsTrigger>
                                <TabsTrigger value="month">Month</TabsTrigger>
                                <TabsTrigger value="year">Year</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="text-sm text-destructive">{error}</div>
                ) : (
                    <DataTable<any>
                        data={rankedData}
                        columns={columns}
                        searchableFields={["name"]}
                        pageSize={5}
                        enableRowSelection={false}
                        isLoading={loading}
                    />
                )}
            </CardContent>
        </Card>
    );
}

export default ContributorsLeaderboard;


