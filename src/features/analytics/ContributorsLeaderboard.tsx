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
import { useMemo, useState } from "react";

export interface ContributorRow {
    id: string;
    name: string;
    commits: number;
    projectId?: string;
    repositoryId?: string;
}

interface ContributorsLeaderboardProps {
    title?: string;
    description?: string;
    data: ContributorRow[];
    projects?: Array<{ id: string; name: string }>;
    repositories?: Array<{ id: string; name: string }>;
}

export function ContributorsLeaderboard({
    title = "Top Contributors",
    description = "Most active contributors",
    data,
    projects = [],
    repositories = [],
}: ContributorsLeaderboardProps) {
    const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || "");
    const [selectedRepo, setSelectedRepo] = useState<string>(repositories[0]?.id || "");

    const rankedData = useMemo(() => {
        const filtered = data.filter((row) => {
            const byProject = selectedProject ? row.projectId === selectedProject : true;
            const byRepo = selectedRepo ? row.repositoryId === selectedRepo : true;
            return byProject && byRepo;
        });
        const total = filtered.reduce((sum, r) => sum + r.commits, 0) || 1;
        const sorted = [...filtered].sort((a, b) => b.commits - a.commits);
        return sorted.map((row, idx) => ({
            ...row,
            rank: idx + 1,
            percent: Math.round((row.commits / total) * 1000) / 10,
        }));
    }, [data, selectedProject, selectedRepo]);

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
                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by project" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* No global option per spec */}
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by repository" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* No global option per spec */}
                                {repositories.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable<any>
                    data={rankedData}
                    columns={columns}
                    searchableFields={["name"]}
                    pageSize={5}
                    enableRowSelection={false}
                />
            </CardContent>
        </Card>
    );
}

export default ContributorsLeaderboard;


