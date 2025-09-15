"use client";

import { Bell, LogOut, Search, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore, Notification } from "@/stores/notificationStore";
import { useProjectStore } from "@/stores/projectStore";
import { useRepositoryStore } from "@/stores/repositoryStore";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { logout, user } = useAuthStore();
  const { currentProject, isLoading } = useProjectStore();
  const {
    currentRepository,
    isLoading: repoLoading,
    fetchRepositoryById,
  } = useRepositoryStore();

  const {
    notifications,
    unreadCount,
    markAsRead,
    connect,
    disconnect,
    fetchInitialNotifications,
  } = useNotificationStore();

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  // Fetch repository data when navigating inside repo pages
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const repoIndex = parts.indexOf("repositories");
    if (repoIndex !== -1 && parts[repoIndex + 1]) {
      const repoId = parts[repoIndex + 1];
      if (!currentRepository || currentRepository._id !== repoId) {
        fetchRepositoryById(repoId);
      }
    }
  }, [pathname, currentRepository, fetchRepositoryById]);

  // Connect to notifications when user is logged in
  useEffect(() => {
    if (user) {
      fetchInitialNotifications();
      connect();
    }
    return () => disconnect();
  }, [user, connect, disconnect, fetchInitialNotifications]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
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
        }
      }

      if (index > 0 && parts[index - 1] === "repositories") {
        if (currentRepository && part === currentRepository._id) {
          label = currentRepository.name;
        } else if (repoLoading) {
          label = "Loading...";
        }
      }

      return {
        label,
        href,
        isLast: index === parts.length - 1,
      };
    });
  }, [pathname, currentProject, isLoading, currentRepository, repoLoading]);

  const mobileBreadcrumbs = useMemo(
    () =>
      breadcrumbs.length <= 2
        ? breadcrumbs
        : [breadcrumbs[breadcrumbs.length - 2], breadcrumbs[breadcrumbs.length - 1]],
    [breadcrumbs]
  );

  const tabletBreadcrumbs = useMemo(
    () =>
      breadcrumbs.length <= 3
        ? breadcrumbs
        : [
            breadcrumbs[breadcrumbs.length - 3],
            breadcrumbs[breadcrumbs.length - 2],
            breadcrumbs[breadcrumbs.length - 1],
          ],
    [breadcrumbs]
  );

  // Logout
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Handle notifications
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    setIsNotificationDropdownOpen(false);
    if (notification.entityModel && notification.entityId) {
      router.push(
        `/dashboard/${notification.entityModel.toLowerCase()}s/${notification.entityId}`
      );
    }
  };

  const recentNotifications = notifications.slice(0, 4);

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 h-14">
        {/* Left side: Sidebar + Breadcrumbs */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1 min-w-0">
            <Breadcrumb>
              {/* Desktop */}
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

              {/* Tablet */}
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

              {/* Mobile */}
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

        {/* Right side: Search, Theme, Notifications, User */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search (hidden on mobile) */}
          <div className="hidden md:block relative">
            <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search... (⌘K)"
              className="pl-8 w-[200px] lg:w-[250px]"
            />
          </div>

          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu
            open={isNotificationDropdownOpen}
            onOpenChange={setIsNotificationDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative flex">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="px-2 py-1.5 font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif._id}
                      onSelect={() => handleNotificationClick(notif)}
                      className={`flex items-start gap-3 p-2 cursor-pointer ${
                        !notif.isRead ? "bg-muted/50" : ""
                      }`}
                    >
                      {!notif.isRead && (
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                      <div
                        className={`flex-1 text-sm ${
                          !notif.isRead
                            ? "font-semibold"
                            : "font-normal text-muted-foreground"
                        }`}
                      >
                        {notif.message}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    You're all caught up!
                  </p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/notification"
                  className="w-full flex justify-center py-2 text-sm font-semibold text-primary hover:bg-muted"
                >
                  Show All Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full w-8 h-8"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.profileImage ?? undefined}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {user?.fullName?.[0]?.toUpperCase() ?? "U"}
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
