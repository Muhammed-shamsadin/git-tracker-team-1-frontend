"use client";

import {
    Home,
    Settings,
    Users,
    FolderGit2,
    GitBranch,
    BarChart3,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Badge } from "../ui/badge";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderGit2,
    },
    {
        title: "Repositories",
        url: "/dashboard/repositories",
        icon: GitBranch,
    },
    {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Developers",
        url: "/dashboard/developers",
        icon: Users,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
    },
];

const bottomItems = [
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const { user, isLoading } = useAuthStore();

    useEffect(
        () => {},
        [user, isLoading] // Re-run effect when user changes
    );
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary rounded-lg w-8 h-8 text-primary-foreground">
                        <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">Git Tracker</h2>
                        <p className="text-muted-foreground text-xs">
                            Development Dashboard
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard">
                                        <Home />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/projects">
                                        <FolderGit2 />
                                        <span>Projects</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/repositories">
                                        <GitBranch />
                                        <span>Repositories</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {user?.userType === "superadmin" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/clients">
                                            <Users />
                                            <span>Clients</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {(user?.userType === "superadmin" ||
                                user?.userType === "client") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/developers">
                                            <Users />
                                            <span>Developers</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {(user?.userType === "developer" ||
                                user?.userType === "client") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/dashboard/analytics">
                                            <BarChart3 />
                                            <span>Analytics</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/settings">
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profileImage ?? undefined} />
                        <AvatarFallback>
                            {user?.fullName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col justify-center">
                            <p className="font-medium text-sm truncate">
                                {user?.fullName}
                            </p>
                            <Badge>{user?.userType}</Badge>
                        </div>
                        <p className="text-muted-foreground text-xs truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
