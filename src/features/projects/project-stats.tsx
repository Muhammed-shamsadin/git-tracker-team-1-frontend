"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import { ProjectDetail } from "@/types/Project";
import {
    GitBranch,
    Users,
    Clock,
    AlertCircle,
    GitCommit,
    GitPullRequest,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface ProjectStatsProps {
    project: ProjectDetail;
    isLoading?: boolean;
    error?: string | null;
}

export function ProjectStats({
    project,
    isLoading = false,
    error,
}: ProjectStatsProps) {
    const stats = useMemo(() => {
        if (!project) return [];

        return [
            {
                title: "Repositories",
                value: project.repositories?.length ?? 0,
                icon: GitBranch,
                description: "Total repositories in project",
            },
            {
                title: "Team Members",
                value: project.members?.length ?? 0,
                icon: Users,
                description: "Active team members",
            },
            {
                title: "Commits",
                value: project.commitsCount ?? 0,
                icon: GitCommit,
                description: "Total commits across repositories",
            },
            {
                title: "Last Updated",
                value: project.updatedAt ? timeAgo(project.updatedAt) : "Never",
                icon: Clock,
                description: "Last project update",
                isString: true,
            },
        ];
    }, [project]);

    if (error) {
        return (
            <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-medium text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Error loading stats
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive/80 text-sm">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
            {isLoading
                ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                          <Skeleton key={i} className="w-full h-[110px]" />
                      ))
                : stats.map((stat) => (
                      <Card
                          key={stat.title}
                          className="hover:shadow-sm transition-shadow"
                      >
                          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                              <CardTitle className="font-medium text-muted-foreground text-sm">
                                  {stat.title}
                              </CardTitle>
                              <stat.icon className="w-4 h-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="font-bold text-2xl">
                                  {stat.value}
                              </div>
                              {stat.description && (
                                  <p className="mt-1 text-muted-foreground text-xs">
                                      {stat.description}
                                  </p>
                              )}
                          </CardContent>
                      </Card>
                  ))}
        </div>
    );
}
