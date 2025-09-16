"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, GitBranch } from "lucide-react";
import { ProjectDetail } from "@/types/Project";

export function ProjectStatsGrid({ project }: { project: ProjectDetail }) {
    const membersCount = Math.max(
        project.membersCount ?? 0,
        project.members?.length ?? 0
    );
    return (
        <div className="gap-4 grid md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Total Commits
                    </CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {project.commitsCount ?? 0}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Team Members
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">{membersCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Repositories
                    </CardTitle>
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {project.repositories?.length ?? 0}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Repository Limit
                    </CardTitle>
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {project.repoLimit ?? 0}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
