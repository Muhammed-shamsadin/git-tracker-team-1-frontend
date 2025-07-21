"use client";
import {
    BarChart3,
    FolderKanban,
    GitBranch,
    LayoutGrid,
    Settings,
    Users,
    GitFork,
    Star,
    Plus,
    Building,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroupAction,
} from "@/components/ui/sidebar";

const mainNavigation = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanban,
    },
    {
        title: "Repositories",
        url: "/dashboard/repositories",
        icon: GitBranch,
    },
    {
        title: "Developers",
        url: "/dashboard/developers",
        icon: Users,
    },
    {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Building,
    },
];

const analyticsNavigation = [
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

const favoriteItems = [
    {
        title: "Web Application",
        url: "/dashboard/projects/1",
        type: "project",
    },
    {
        title: "mobile-app",
        url: "/dashboard/repositories/3",
        type: "repository",
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="my-2.5 pb-2 border-sidebar-border border-b">
                <SidebarMenu>
                    <SidebarMenuItem className="h-full">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/dashboard" className="py-1">
                                <GitFork className="size-4 text-primary" />
                                <span className="font-semibold text-base">
                                    GitTracker
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="mt-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavigation.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Favorites</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus className="size-4" />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {favoriteItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <Star className="fill-current size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Analytics & Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analyticsNavigation.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
