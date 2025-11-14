import axiosClient from "@/services/httpClient";

export const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  logout: () => axiosClient.get("/auth/logout"),
  getPublicProfile: () => axiosClient.get("/users/profile"),
  getMyProfile: () => axiosClient.get("/users/me"),
  updateMyProfile: (formData) =>
    axiosClient.patch("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
