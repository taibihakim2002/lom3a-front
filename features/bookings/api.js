import axiosClient from "@/services/httpClient";

export const bookingsApi = {
  // إنشاء حجز (عام)
  create: (data) => axiosClient.post("/bookings", data),

  // جلب كل الحجوزات (مسؤول)
  getAll: () => axiosClient.get("/bookings?sort=-createdAt"), // الأحدث أولاً

  // تحديث الحالة (مسؤول)
  updateStatus: ({ id, status }) => axiosClient.patch(`/bookings/${id}`, { status }),

  // حذف حجز (مسؤول)
  delete: (id) => axiosClient.delete(`/bookings/${id}`),
};