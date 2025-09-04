// TODO: Uncomment and update the notification store implementation when the API is ready

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import api from "@/lib/axios";

// export interface Notification {
//     _id: string;
//     type: "alert" | "assignment" | "comment" | "commit" | "project_update";
//     title: string;
//     message: string;
//     userId: string;
//     isRead: boolean;
//     metadata?: {
//         projectId?: string;
//         repositoryId?: string;
//         commitId?: string;
//         authorId?: string;
//     };
//     createdAt: string;
//     updatedAt: string;
// }

// interface PaginatedNotifications {
//     notifications: Notification[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//     unreadCount: number;
// }

// interface NotificationFilters {
//     type?: string;
//     isRead?: boolean;
//     startDate?: string;
//     endDate?: string;
// }

// interface NotificationState {
//     notifications: Notification[];
//     paginatedNotifications: PaginatedNotifications | null;
//     unreadCount: number;
//     isLoading: boolean;
//     error: string | null;
//     filters: NotificationFilters;

//     // Fetch operations
//     fetchNotifications: (
//         page?: number,
//         limit?: number,
//         filters?: NotificationFilters
//     ) => Promise<void>;
//     fetchUnreadCount: () => Promise<void>;

//     // Actions
//     markAsRead: (notificationId: string) => Promise<boolean>;
//     markAllAsRead: () => Promise<boolean>;
//     deleteNotification: (notificationId: string) => Promise<boolean>;
//     deleteAllRead: () => Promise<boolean>;

//     // Filters
//     setFilters: (filters: NotificationFilters) => void;
//     clearFilters: () => void;

//     // Real-time updates (for future WebSocket integration)
//     addNotification: (notification: Notification) => void;
//     updateNotification: (
//         notificationId: string,
//         updates: Partial<Notification>
//     ) => void;
// }

// export const useNotificationStore = create<NotificationState>()(
//     persist(
//         (set, get) => ({
//             notifications: [],
//             paginatedNotifications: null,
//             unreadCount: 0,
//             isLoading: false,
//             error: null,
//             filters: {},

//             fetchNotifications: async (
//                 page = 1,
//                 limit = 20,
//                 filters?: NotificationFilters
//             ) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const currentFilters = filters || get().filters;
//                     const params = new URLSearchParams({
//                         page: page.toString(),
//                         limit: limit.toString(),
//                         ...currentFilters,
//                     });

//                     const response = await api.get(
//                         `/dashboard/notifications?${params}`
//                     );
//                     const data = response.data.data || response.data;

//                     const paginated: PaginatedNotifications = {
//                         notifications: data.notifications || data,
//                         total: data.total || 0,
//                         page: data.page || page,
//                         limit: data.limit || limit,
//                         totalPages: data.totalPages || 1,
//                         unreadCount: data.unreadCount || 0,
//                     };

//                     set({
//                         notifications: paginated.notifications,
//                         paginatedNotifications: paginated,
//                         unreadCount: paginated.unreadCount,
//                         isLoading: false,
//                     });
//                 } catch (error: any) {
//                     set({
//                         error: error.message || "Failed to fetch notifications",
//                         isLoading: false,
//                     });
//                 }
//             },

//             fetchUnreadCount: async () => {
//                 try {
//                     const response = await api.get(
//                         "/dashboard/notifications/unread-count"
//                     );
//                     const count =
//                         response.data.data?.count || response.data.count || 0;
//                     set({ unreadCount: count });
//                 } catch (error: any) {
//                     console.error("Failed to fetch unread count:", error);
//                 }
//             },

//             markAsRead: async (notificationId: string) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const response = await api.patch(
//                         `/dashboard/notifications/${notificationId}/read`
//                     );

//                     if (response.status === 200) {
//                         set((state) => ({
//                             notifications: state.notifications.map(
//                                 (notification) =>
//                                     notification._id === notificationId
//                                         ? { ...notification, isRead: true }
//                                         : notification
//                             ),
//                             unreadCount: Math.max(0, state.unreadCount - 1),
//                             isLoading: false,
//                         }));
//                         return true;
//                     }
//                     set({ isLoading: false });
//                     return false;
//                 } catch (error: any) {
//                     set({
//                         error:
//                             error.message ||
//                             "Failed to mark notification as read",
//                         isLoading: false,
//                     });
//                     return false;
//                 }
//             },

//             markAllAsRead: async () => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const response = await api.patch(
//                         "/dashboard/notifications/mark-all-read"
//                     );

//                     if (response.status === 200) {
//                         set((state) => ({
//                             notifications: state.notifications.map(
//                                 (notification) => ({
//                                     ...notification,
//                                     isRead: true,
//                                 })
//                             ),
//                             unreadCount: 0,
//                             isLoading: false,
//                         }));
//                         return true;
//                     }
//                     set({ isLoading: false });
//                     return false;
//                 } catch (error: any) {
//                     set({
//                         error:
//                             error.message ||
//                             "Failed to mark all notifications as read",
//                         isLoading: false,
//                     });
//                     return false;
//                 }
//             },

//             deleteNotification: async (notificationId: string) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const response = await api.delete(
//                         `/dashboard/notifications/${notificationId}`
//                     );

//                     if (response.status === 200) {
//                         set((state) => {
//                             const notification = state.notifications.find(
//                                 (n) => n._id === notificationId
//                             );
//                             const wasUnread =
//                                 notification && !notification.isRead;

//                             return {
//                                 notifications: state.notifications.filter(
//                                     (notification) =>
//                                         notification._id !== notificationId
//                                 ),
//                                 unreadCount: wasUnread
//                                     ? Math.max(0, state.unreadCount - 1)
//                                     : state.unreadCount,
//                                 isLoading: false,
//                             };
//                         });
//                         return true;
//                     }
//                     set({ isLoading: false });
//                     return false;
//                 } catch (error: any) {
//                     set({
//                         error: error.message || "Failed to delete notification",
//                         isLoading: false,
//                     });
//                     return false;
//                 }
//             },

//             deleteAllRead: async () => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const response = await api.delete(
//                         "/dashboard/notifications/read"
//                     );

//                     if (response.status === 200) {
//                         set((state) => ({
//                             notifications: state.notifications.filter(
//                                 (notification) => !notification.isRead
//                             ),
//                             isLoading: false,
//                         }));
//                         return true;
//                     }
//                     set({ isLoading: false });
//                     return false;
//                 } catch (error: any) {
//                     set({
//                         error:
//                             error.message ||
//                             "Failed to delete read notifications",
//                         isLoading: false,
//                     });
//                     return false;
//                 }
//             },

//             setFilters: (filters: NotificationFilters) => {
//                 set({ filters });
//             },

//             clearFilters: () => {
//                 set({ filters: {} });
//             },

//             addNotification: (notification: Notification) => {
//                 set((state) => ({
//                     notifications: [notification, ...state.notifications],
//                     unreadCount: !notification.isRead
//                         ? state.unreadCount + 1
//                         : state.unreadCount,
//                 }));
//             },

//             updateNotification: (
//                 notificationId: string,
//                 updates: Partial<Notification>
//             ) => {
//                 set((state) => ({
//                     notifications: state.notifications.map((notification) =>
//                         notification._id === notificationId
//                             ? { ...notification, ...updates }
//                             : notification
//                     ),
//                 }));
//             },
//         }),
//         {
//             name: "notification-storage",
//             partialize: (state) => ({
//                 unreadCount: state.unreadCount,
//                 filters: state.filters,
//             }),
//         }
//     )
// );
