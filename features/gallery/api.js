import axiosClient from "@/services/httpClient";

export const galleryApi = {
  getAll: () => axiosClient.get("/gallery"),
  delete: (id) => axiosClient.delete(`/gallery/${id}`),
  
  // (مهم: إرسال FormData لرفع الصورة)
  create: (formData) => axiosClient.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};