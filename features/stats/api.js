import axiosClient from "@/services/httpClient";

export const statsApi = {
  getDashboardStats: () => axiosClient.get("/stats"),
};