"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GitCommit, Users, FileText, Activity } from "lucide-react";
import { Repository } from "@/types/Repository";

interface RepositoryStatsGridProps {
    repository: Repository;
}

export function RepositoryStatsGrid({ repository }: RepositoryStatsGridProps) {
    const stats = {
        total_commits: repository?.commitsCount || 0,
        total_contributors: repository?.contributorsCount || 0,
        files_count: repository?.filesCount || 0,
        lines_of_code: repository?.linesOfCode || 0,
    };

    return (
        <div className="gap-4 grid md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Total Commits
                    </CardTitle>
                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {stats.total_commits}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Contributors
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {stats.total_contributors}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">Files</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {stats.files_count}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Lines of Code
                    </CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {Math.abs(stats.lines_of_code).toLocaleString()}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
