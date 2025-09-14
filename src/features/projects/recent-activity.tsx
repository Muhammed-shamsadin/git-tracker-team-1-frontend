"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { GitCommit } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useGitDataStore, CommitData } from "@/stores/gitDataStore";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

/**
 * RecentActivity Component - Displays recent commit activity
 *
 * This component is highly reusable and can be configured for different contexts:
 *
 * @example
 * // Project-wide activity
 * <RecentActivity
 *   projectId="project123"
 *   title="Recent Project Activity"
 *   showRepository={true}
 *   showDeveloper={true}
 * />
 *
 * @example
 * // Repository-specific activity
 * <RecentActivity
 *   repositoryId="repo456"
 *   title="Recent Repository Activity"
 *   showRepository={false}
 *   showDeveloper={true}
 * />
 *
 * @example
 * // Member-specific activity
 * <RecentActivity
 *   projectId="project123"
 *   developerId="dev789"
 *   title="Recent Member Activity"
 *   showRepository={true}
 *   showDeveloper={false}
 * />
 */

interface RecentActivityProps {
    // Filter options - can be used individually or combined
    projectId?: string;
    repositoryId?: string;
    developerId?: string;
    // Display options
    title?: string;
    limit?: number;
    showRepository?: boolean;
    showDeveloper?: boolean;
    className?: string;
}

export function RecentActivity({
    projectId,
    repositoryId,
    developerId,
    title = "Recent Activity",
    limit = 5,
    showRepository = true,
    showDeveloper = true,
    className,
}: RecentActivityProps) {
    const { commits, fetchCommits, isLoading, error } = useGitDataStore();

    // Fetch commits based on the provided filters
    useEffect(() => {
        const fetchData = async () => {
            await fetchCommits({
                page: 1,
                limit: limit,
                projectId: projectId,
                repoId: repositoryId,
                developerId: developerId,
            });
        };

        // Only fetch if we have at least one filter
        if (projectId || repositoryId || developerId) {
            fetchData();
        }
    }, [projectId, repositoryId, developerId, limit, fetchCommits]);

    // Transform commits into activity items
    const activities = useMemo(() => {
        if (!commits || commits.length === 0) return [];

        return commits.slice(0, limit).map((commit: CommitData) => {
            // Handle union types for developerId and repoId
            const developer =
                typeof commit.developerId === "object"
                    ? commit.developerId
                    : {
                          _id: commit.developerId,
                          fullName: "Unknown Developer",
                          email: "",
                      };

            const repository =
                typeof commit.repoId === "object"
                    ? commit.repoId
                    : { _id: commit.repoId, name: "Unknown Repository" };

            // Generate meaningful display name for developer
            const developerName =
                developer.fullName || developer.email || "Unknown Developer";
            const initials = developer.fullName
                ? developer.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                : developer.email
                ? developer.email.substring(0, 2).toUpperCase()
                : "UD";

            return {
                id: commit._id,
                commitHash: commit.commitHash,
                user: developerName,
                userEmail: developer.email,
                action: commit.message.split("\n")[0], // First line of commit message
                time: timeAgo(commit.timestamp),
                type: "commit",
                repository: repository.name || "Unknown Repository",
                repositoryId: repository._id,
                branch: commit.branch,
                stats: commit.stats,
                initials: initials,
            };
        });
    }, [commits, limit]);

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array(limit)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton className="rounded-full w-2 h-2" />
                                    <Skeleton className="rounded-full w-8 h-8" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="w-3/4 h-4" />
                                        <Skeleton className="w-1/2 h-3" />
                                    </div>
                                    <Skeleton className="w-12 h-4" />
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-4 text-center">
                        <p className="text-muted-foreground text-sm">
                            Failed to load recent activity
                        </p>
                        <p className="mt-1 text-red-500 text-xs">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (activities.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-4 text-center">
                        <GitCommit className="mx-auto mb-2 w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            No recent activity found
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitCommit className="w-5 h-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3"
                        >
                            {/* Activity indicator dot */}
                            <div className="flex-shrink-0 bg-green-500 mt-2 rounded-full w-2 h-2" />

                            {/* User avatar */}
                            <Avatar className="flex-shrink-0 w-8 h-8">
                                <AvatarFallback className="text-xs">
                                    {activity.initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* Activity content */}
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                {activity.user}
                                            </span>{" "}
                                            <span className="text-muted-foreground">
                                                committed
                                            </span>
                                        </p>

                                        {/* Commit message as a link */}
                                        <Link
                                            href={`/dashboard/repositories/${activity.repositoryId}/commits/${activity.id}`}
                                            className="block font-medium text-foreground text-sm hover:underline truncate"
                                        >
                                            {activity.action.length > 60
                                                ? activity.action.slice(0, 60) +
                                                  "..."
                                                : activity.action}
                                        </Link>

                                        {/* Additional info */}
                                        <div className="flex items-center gap-2 mt-1">
                                            {showRepository && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {activity.repository}
                                                </Badge>
                                            )}
                                            <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                                {activity.branch}
                                            </code>
                                            {activity.stats && (
                                                <span className="text-muted-foreground text-xs">
                                                    {
                                                        activity.stats
                                                            .files_changed
                                                    }{" "}
                                                    files
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
