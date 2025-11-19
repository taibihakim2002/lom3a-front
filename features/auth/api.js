import axiosClient from "@/services/httpClient";

export const authApi = {
  register: (formData) => axiosClient.post("/auth/register", formData),
  login: (data) => axiosClient.post("/auth/login", data),
  logout: () => axiosClient.get("/auth/logout"),
  getMyProfile: () => axiosClient.get("/auth/me"),
  getPublicProfile: () => axiosClient.get("/users/profile"),
  updateMyProfile: (formData) =>
    axiosClient.patch("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  checkAuthStatus: async () => {
    const { data } = await axiosClient.get("/auth/status");
    return data; 
  },
};