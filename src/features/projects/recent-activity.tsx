"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetail } from "@/types/Project";
import { useMemo } from "react";

interface RecentActivityProps {
    project?: ProjectDetail;
    isLoading?: boolean;
}

// Mock activities - in a real app, this would come from an API
const getMockActivities = (project?: ProjectDetail) => [
    {
        user: "System",
        action: `Project "${project?.name || "Unknown"}" created`,
        time: "2h ago",
        type: "project",
        initials: "SY",
    },
    {
        user: "Jane Smith",
        action: "opened PR #142",
        time: "4h ago",
        type: "pr",
        initials: "JS",
    },
    {
        user: "Mike Johnson",
        action: "reported issue #89",
        time: "1d ago",
        type: "issue",
        initials: "MJ",
    },
    {
        user: "Deployment",
        action: "to production successful",
        time: "2d ago",
        type: "deployment",
        initials: "D",
    },
];

const getActivityColor = (type: string) => {
    switch (type) {
        case "commit":
            return "bg-green-100 text-green-800";
        case "pr":
            return "bg-blue-100 text-blue-800";
        case "issue":
            return "bg-orange-100 text-orange-800";
        case "deployment":
            return "bg-purple-100 text-purple-800";
        case "project":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export function RecentActivity({
    project,
    isLoading = false,
}: RecentActivityProps) {
    const activities = useMemo(() => getMockActivities(project), [project]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton className="rounded-full w-2 h-2" />
                                    <Skeleton className="rounded-full w-6 h-6" />
                                    <Skeleton className="flex-1 h-4" />
                                    <Skeleton className="w-12 h-4" />
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    getActivityColor(activity.type)
                                        .replace("text-", "bg-")
                                        .split(" ")[0]
                                }`}
                            />
                            <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                    {activity.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                    <span className="font-medium">
                                        {activity.user}
                                    </span>{" "}
                                    <span className="text-muted-foreground">
                                        {activity.action}
                                    </span>
                                </p>
                            </div>
                            <span className="text-muted-foreground text-xs">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
