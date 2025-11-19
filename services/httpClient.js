import axios from "axios";
import useAuthStore from "@/store/authStore";

const URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_API_KEY;

const axiosClient = axios.create({
  baseURL: URL,
  headers: { "x-api-key": TOKEN },
  withCredentials: true,
});

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       const { clearUser } = useAuthStore.getState();
//       clearUser();
//       if (typeof window !== "undefined") {
//         window.location.href = "/admin/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
