import { create } from "zustand";
import api from "@/lib/axios";
import { produce } from "immer";

export interface Notification {
    _id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    entityId?: string;
    entityModel?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    eventSource: EventSource | null;
    connect: () => void;
    disconnect: () => void;
    fetchInitialNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    eventSource: null,

    connect: () => {
        if (get().eventSource) return;

        const token = localStorage.getItem("auth-token");
        if (!token) {
            console.error("No auth token found for SSE connection.");
            return;
        }
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const eventSource = new EventSource(
            `${baseUrl}/notifications/stream?token=${token}`
        );

        eventSource.onopen = () => console.log("SSE Connection Opened.");

        eventSource.onmessage = (event) => {
            // --- THIS IS THE FIX ---
            // The backend SSE sends a JSON string like: '{"data":{"_id":"...", "message": "..."}}'
            // We must parse this string and then access the inner 'data' property.
            const eventData = JSON.parse(event.data);
            const newNotification: Notification = eventData.data || eventData;

            // Safety check to prevent errors if the data is malformed
            if (!newNotification || !newNotification._id) {
                console.warn(
                    "Received a malformed notification via SSE:",
                    eventData
                );
                return;
            }

            set(
                produce((state: NotificationState) => {
                    // Prevent duplicate notifications from being added (handles race conditions)
                    if (
                        !state.notifications.some(
                            (n) => n._id === newNotification._id
                        )
                    ) {
                        state.notifications.unshift(newNotification);
                        if (!newNotification.isRead) {
                            state.unreadCount += 1;
                        }
                    }
                })
            );
        };

        eventSource.onerror = (error) => {
            eventSource.close();
            set({ eventSource: null });
        };
        set({ eventSource });
    },

    disconnect: () => {
        get().eventSource?.close();
        set({ eventSource: null });
        console.log("SSE Connection Closed.");
    },

    fetchInitialNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get("/notifications");
            // This logic correctly handles if your API wraps the response in a 'data' object or not.
            const notifications = response.data.data || response.data;
            const unreadCount = notifications.filter(
                (n: Notification) => !n.isRead
            ).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.message ||
                    "Failed to fetch notifications",
                isLoading: false,
            });
        }
    },

    markAsRead: async (notificationId: string) => {
        const originalState = {
            notifications: get().notifications,
            unreadCount: get().unreadCount,
        };
        const notificationToUpdate = originalState.notifications.find(
            (n) => n._id === notificationId
        );
        if (!notificationToUpdate || notificationToUpdate.isRead) return;

        set(
            produce((state: NotificationState) => {
                const notification = state.notifications.find(
                    (n) => n._id === notificationId
                );
                if (notification) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
        );
        try {
            await api.patch(`/notifications/${notificationId}/read`);
        } catch (error) {
            set(originalState);
            console.error("Failed to mark notification as read:", error);
        }
    },

    markAllAsRead: async () => {
        if (get().unreadCount === 0) return;
        const originalState = {
            notifications: get().notifications,
            unreadCount: get().unreadCount,
        };
        set(
            produce((state: NotificationState) => {
                state.notifications.forEach((n) => {
                    n.isRead = true;
                });
                state.unreadCount = 0;
            })
        );
        try {
            await api.patch("/notifications/read-all");
        } catch (error) {
            set(originalState);
            console.error("Failed to mark all as read:", error);
        }
    },
}));
