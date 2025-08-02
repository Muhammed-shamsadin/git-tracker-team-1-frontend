"use client";

import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";

export default function AppNavbar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const { currentProject, isLoading } = useProjectStore();

    const breadcrumbs = React.useMemo(() => {
        const parts = pathname.split("/").filter(Boolean);

        return parts.map((part, index) => {
            const href = `/${parts.slice(0, index + 1).join("/")}`;
            let label = part
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

            if (index > 0 && parts[index - 1] === "projects") {
                if (currentProject && part === currentProject._id) {
                    label = currentProject.name;
                } else if (isLoading) {
                    label = "Loading...";
                } else {
                    label = part;
                }
            }

            return {
                label,
                href,
                isLast: index === parts.length - 1,
            };
        });
    }, [pathname, currentProject, isLoading]);

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 px-4 sm:px-6 py-2 h-auto sm:h-14">
                <div className="flex flex-1 items-center gap-2 min-w-0">
                    <SidebarTrigger className="-ml-1" />
                    <div className="min-w-0 overflow-x-auto whitespace-nowrap">
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center gap-1 text-sm">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.href}>
                                        {index > 0 && <BreadcrumbSeparator />}
                                        <BreadcrumbItem>
                                            {crumb.isLast ? (
                                                <BreadcrumbPage className="max-w-[140px] sm:max-w-none truncate">
                                                    {crumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink
                                                    href={crumb.href}
                                                    className="max-w-[140px] sm:max-w-none truncate"
                                                >
                                                    {crumb.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Collapsible Search */}
                    <div className="hidden md:block relative">
                        <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search... (⌘K)"
                            className="pl-8 w-[200px] lg:w-[250px]"
                        />
                    </div>

                    <ThemeToggle />

                    <Button variant="ghost" size="icon">
                        <Bell className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
