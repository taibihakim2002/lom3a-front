import axiosClient from "@/services/httpClient";

export const notificationsApi = {
  getUnreadCount: () => axiosClient.get("/notifications/unread-count"),
  // --- الدوال الجديدة ---
  getAll: () => axiosClient.get("/notifications"),
  markAllRead: () => axiosClient.patch("/notifications/mark-all-read"),
};