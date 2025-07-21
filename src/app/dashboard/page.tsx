import {
    FolderKanban,
    GitBranch,
    Users,
    AlertCircle,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/cards/stats-card";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { QuickActionsMenu } from "@/features/dashboard/components/quick-action-menu";

const recentProjects = [
    {
        id: 1,
        name: "Web Application",
        status: "active",
        repos: 8,
        lastActive: "2 hours ago",
    },
    {
        id: 2,
        name: "Mobile App",
        status: "active",
        repos: 4,
        lastActive: "1 day ago",
    },
    {
        id: 3,
        name: "API Service",
        status: "active",
        repos: 12,
        lastActive: "3 hours ago",
    },
];

const recentRepositories = [
    {
        id: 1,
        name: "web-frontend",
        project: "Web Application",
        lastCommit: "2 hours ago",
        status: "active",
    },
    {
        id: 2,
        name: "api-backend",
        project: "Web Application",
        lastCommit: "4 hours ago",
        status: "active",
    },
    {
        id: 3,
        name: "mobile-app",
        project: "Mobile App",
        lastCommit: "1 day ago",
        status: "active",
    },
];

const stats = [
    {
        title: "Total Projects",
        value: 24,
        change: { value: 12, type: "increase" },
        icon: <FolderKanban className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Active Repositories",
        value: 156,
        change: { value: 8, type: "increase" },
        icon: <GitBranch className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Team Members",
        value: 32,
        change: { value: 4, type: "increase" },
        icon: <Users className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: "Pending Actions",
        value: 8,
        change: { value: 2, type: "decrease" },
        icon: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
    },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your
                        repositories.
                    </p>
                </div>
                <QuickActionsMenu />
            </div>

            {/* Stats Overview */}

            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                    />
                ))}
            </div>
        </div>
    );
}
