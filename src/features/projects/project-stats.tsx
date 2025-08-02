import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/timeAgo";
import { Project } from "@/types/Project";
import { GitBranch, Users, AlertCircle, Clock } from "lucide-react";
import { useMemo } from "react";

export function ProjectStats(currentProject: Project) {
    const stats = useMemo(() => {
        if (!currentProject) return [];
        return [
            {
                title: "Repositories",
                value: currentProject.repositories?.length ?? 0,
                icon: GitBranch,
            },
            {
                title: "Team Members",
                value: currentProject.developers?.length ?? 0,
                icon: Users,
            },
            {
                title: "Total Commits",
                value: currentProject.totalCommits ?? "73",
                icon: AlertCircle,
            },
            {
                title: "Last Updated",
                value: currentProject.updatedAt
                    ? timeAgo(currentProject.updatedAt)
                    : "-",
                icon: Clock,
            },
        ];
    }, [currentProject]);

    if (!currentProject) {
        return (
            <div className="text-muted-foreground">No project selected.</div>
        );
    }

    return (
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-muted-foreground text-sm">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
