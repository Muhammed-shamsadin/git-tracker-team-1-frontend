"use client";

import { Bell, LogOut, Search, Settings, User } from "lucide-react";
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
import { useRepositoryStore } from "@/stores/repositoryStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function AppNavbar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const { currentProject, isLoading } = useProjectStore();
  const {
    currentRepository,
    isLoading: repoLoading,
    fetchRepositoryById,
  } = useRepositoryStore();

  // Effect to fetch repository data when on repository pages
  React.useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const repoIndex = parts.indexOf("repositories");

    if (repoIndex !== -1 && parts[repoIndex + 1]) {
      const repoId = parts[repoIndex + 1];
      // Only fetch if we don't have the current repository or it's a different one
      if (!currentRepository || currentRepository._id !== repoId) {
        fetchRepositoryById(repoId);
      }
    }
  }, [pathname, currentRepository, fetchRepositoryById]);

  const breadcrumbs = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);

    return parts.map((part, index) => {
      const href = `/${parts.slice(0, index + 1).join("/")}`;
      let label = part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Handle project breadcrumbs
      if (index > 0 && parts[index - 1] === "projects") {
        if (currentProject && part === currentProject._id) {
          label = currentProject.name;
        } else if (isLoading) {
          label = "Loading...";
        } else {
          label = part;
        }
      }

      // Handle repository breadcrumbs
      if (index > 0 && parts[index - 1] === "repositories") {
        if (currentRepository && part === currentRepository._id) {
          label = currentRepository.name;
        } else if (repoLoading) {
          label = "Loading...";
        } else {
          label = part;
        }
      }

      return {
        label,
        href,
        isLast: index === parts.length - 1,
        isFirst: index === 0,
      };
    });
  }, [pathname, currentProject, isLoading, currentRepository, repoLoading]);

  // For mobile, show only the last 2 breadcrumbs or just the current page if very small
  const mobileBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs.length <= 2) return breadcrumbs;
    return [
      breadcrumbs[breadcrumbs.length - 2],
      breadcrumbs[breadcrumbs.length - 1],
    ];
  }, [breadcrumbs]);

  // For tablets/medium screens, show only the last 3 breadcrumbs
  const tabletBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs.length <= 3) return breadcrumbs;
    return [
      breadcrumbs[breadcrumbs.length - 3],
      breadcrumbs[breadcrumbs.length - 2],
      breadcrumbs[breadcrumbs.length - 1],
    ];
  }, [breadcrumbs]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 h-14">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1 min-w-0">
            <Breadcrumb>
              {/* Desktop breadcrumbs - full navigation for large screens */}
              <BreadcrumbList className="hidden lg:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="max-w-[200px] truncate">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="max-w-[160px] truncate"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>

              {/* Tablet breadcrumbs - show only last 3 items for medium screens */}
              <BreadcrumbList className="hidden lg:hidden sm:flex items-center gap-1 text-sm">
                {tabletBreadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="max-w-[120px] truncate">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="max-w-[100px] truncate"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>

              {/* Mobile breadcrumbs - show only last 2 items */}
              <BreadcrumbList className="sm:hidden flex items-center gap-1 text-sm">
                {mobileBreadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="max-w-[100px] truncate">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="max-w-[80px] truncate"
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

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search - hidden on mobile, shown on medium+ screens */}
          <div className="hidden md:block relative">
            <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search... (⌘K)"
              className="pl-8 w-[200px] lg:w-[250px]"
            />
          </div>

          <ThemeToggle />

          {/* Notifications - hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {/* unread badge */}
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] w-4 h-4">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[320px] p-0"
              align="end"
              forceMount
            >
              <div className="p-3 border-b">
                <p className="font-medium">Notifications</p>
              </div>
              <div className="divide-y">
                <div className="p-3 flex gap-3 items-start">
                  <span className="inline-block w-2 h-2 mt-1 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New commit in git-tracker-backend
                    </p>
                    <p className="text-xs text-muted-foreground">
                      John Doe • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="p-3 flex gap-3 items-start">
                  <span className="inline-block w-2 h-2 mt-1 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Project E-commerce updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jane Smith • 4 hours ago
                    </p>
                  </div>
                </div>
                <div className="p-3 flex gap-3 items-start">
                  <span className="inline-block w-2 h-2 mt-1 rounded-full bg-transparent border border-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New team member added</p>
                    <p className="text-xs text-muted-foreground">
                      Admin • 1 day ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t text-center">
                <Link href="/dashboard/notification" className="text-sm">
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full w-8 h-8">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.profileImage ?? undefined}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {user?.fullName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>   
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm leading-none">
                    {user?.fullName}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
