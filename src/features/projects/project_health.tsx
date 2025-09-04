"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetail } from "@/types/Project";
import { useMemo } from "react";

interface ProjectHealthProps {
    project?: ProjectDetail;
    isLoading?: boolean;
}

export function ProjectHealth({
    project,
    isLoading = false,
}: ProjectHealthProps) {
    const healthMetrics = useMemo(() => {
        // In a real app, these would be calculated from actual project data
        const baseMetrics = [
            {
                name: "Code Coverage",
                value: Math.floor(Math.random() * 30) + 70, // Mock 70-100%
                color: "bg-green-500",
            },
            {
                name: "Build Success Rate",
                value: Math.floor(Math.random() * 10) + 90, // Mock 90-100%
                color: "bg-green-500",
            },
            {
                name: "Active Repositories",
                value: project?.repositories?.length
                    ? Math.round(
                          (project.repositories.length /
                              (project.repoLimit || 10)) *
                              100
                      )
                    : 0,
                color: "bg-blue-500",
            },
        ];

        return baseMetrics;
    }, [project]);

    const securityScore = useMemo(() => {
        // Mock security score based on project activity
        const scores = ["A+", "A", "A-", "B+", "B"];
        return scores[Math.floor(Math.random() * scores.length)];
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Project Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-12 h-4" />
                                </div>
                                <Skeleton className="w-full h-2" />
                            </div>
                        ))}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-8 h-6" />
                        </div>
                        <Skeleton className="w-full h-2" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {healthMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">
                                {metric.name}
                            </span>
                            <span className="text-muted-foreground text-sm">
                                {metric.value}%
                            </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                    </div>
                ))}

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                            Security Score
                        </span>
                        <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                        >
                            {securityScore}
                        </Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                </div>
            </CardContent>
        </Card>
    );
}
