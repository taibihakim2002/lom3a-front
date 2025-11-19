import axiosClient from "@/services/httpClient";

export const testimonialsApi = {
  getAll: () => axiosClient.get("/testimonials"),
  getApproved: () => axiosClient.get("/testimonials/approved"),
 
  create: (formData) => axiosClient.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  
  update: ({ id, data }) => axiosClient.patch(`/testimonials/${id}`, data),
  delete: (id) => axiosClient.delete(`/testimonials/${id}`),
};