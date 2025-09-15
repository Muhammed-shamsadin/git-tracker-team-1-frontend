"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotificationStore, Notification } from "@/stores/notificationStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell, CheckCheck, GitCommit, Users, AlertTriangle, MessageSquare, Settings, UserPlus, UserX, FolderPlus, FolderX
} from "lucide-react";

// --- ENHANCED HELPER FUNCTIONS ---

const getNotificationIcon = (type: string) => {
    switch (type) {
        // Positive / Additive Actions (Green)
        case 'developer_assigned':
        case 'project_assigned':
            return <UserPlus className="w-4 h-4 text-green-500" />;
        case 'success':
            return <CheckCheck className="w-4 h-4 text-green-500" />;
        case 'repo_registration':
            return <FolderPlus className="w-4 h-4 text-green-500" />;
            
        // Negative / Subtractive Actions (Red/Orange)
        case 'developer_removed':
            return <UserX className="w-4 h-4 text-red-500" />;
        case 'project_removed':
            return <FolderX className="w-4 h-4 text-red-500" />;
        case 'error':
            return <AlertTriangle className="w-4 h-4 text-red-500" />;
        case 'warning':
            return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            
        // Neutral / Informational Actions (Blue/Gray)
        case 'info':
        default:
            return <Bell className="w-4 h-4 text-gray-500" />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        // Green for success and additions
        case 'developer_assigned':
        case 'project_assigned':
        case 'success':
        case 'repo_registration':
            return "border-l-green-500";
            
        // Red for errors and removals
        case 'developer_removed':
        case 'project_removed':
        case 'error':
            return "border-l-red-500";
            
        // Yellow for warnings
        case 'warning':
            return "border-l-yellow-500";
            
        // Gray for general info
        case 'info':
        default:
            return "border-l-gray-500";
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
};

export default function NotificationsPage() {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading, fetchInitialNotifications } = useNotificationStore();

    useEffect(() => {
        if (notifications.length === 0) {
            fetchInitialNotifications();
        }
    }, [notifications.length, fetchInitialNotifications]);

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification._id);
        if (notification.entityModel && notification.entityId && notification.entityModel !== 'User') { // Don't navigate on user removal
             router.push(`/dashboard/${notification.entityModel.toLowerCase()}s/${notification.entityId}`);
        }
    };

    if (isLoading && notifications.length === 0) {
        return <div className="p-6">Loading notifications...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your projects and team activities
                        {unreadCount > 0 && (
                            <span className="ml-2">• <span className="font-medium text-blue-600">{unreadCount} unread</span></span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <CheckCheck className="mr-2 w-4 h-4" />
                        Mark All Read
                    </Button>
                    <Button variant="outline"><Settings className="mr-2 w-4 h-4" /> Settings</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> All Notifications</CardTitle>
                    <CardDescription>Recent activity and updates from your projects</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${!notification.isRead ? "bg-muted/50 hover:bg-muted" : "hover:bg-muted/50"} ${notification.entityId ? 'cursor-pointer' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${!notification.isRead ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-muted-foreground text-xs">{formatTimeAgo(notification.createdAt)}</span>
                                                        <Badge variant="outline" className="text-xs capitalize">{notification.type.replace(/_/g, " ")}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!notification.isRead && (
                                                        <Button variant="ghost" size="sm" title="Mark as read" onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}>
                                                            <CheckCheck className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-6 text-center text-muted-foreground">You're all caught up! No notifications here.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}