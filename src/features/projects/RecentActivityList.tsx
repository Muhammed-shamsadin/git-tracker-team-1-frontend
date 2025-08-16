"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "lucide-react";
import { ProjectDetail } from "@/types/Project";

export interface ActivityItem {
    id: string | number;
    type: string;
    message: string;
    author: string;
    repository?: string | null;
    timestamp: string;
    avatar?: string | null;
}

export function RecentActivityList({
    activities,
}: {
    activities: ActivityItem[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                </CardTitle>
                <CardDescription>
                    Latest commits and project updates
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-muted-foreground text-sm">
                        No recent activity.
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3"
                        >
                            {activity.avatar ? (
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={activity.avatar} />
                                    <AvatarFallback>
                                        {activity.author[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8">
                                    <Activity className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex-1 space-y-1">
                                <p className="font-medium text-sm">
                                    {activity.message}
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                    <span>{activity.author}</span>
                                    {activity.repository && (
                                        <>
                                            <span>•</span>
                                            <span>{activity.repository}</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span>{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
