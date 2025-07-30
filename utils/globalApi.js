import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_API_KEY;

const axiosClient = axios.create({
  baseURL: URL,
  headers: {
    "x-api-key": TOKEN,
  },
  withCredentials: true,
});


axiosClient.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if the error is a 401 Unauthorized response
        if (error.response && error.response.status === 401) {
            // Get the clearUser function from the Zustand store
            const { clearUser } = useAuthStore.getState();
            
            // Clear the user from the state
            clearUser();
            
            // Redirect to the login page
            // We use window.location to ensure a full page reload and state reset
            if (typeof window !== 'undefined') {
                window.location.href = '/dashboard/login';
            }
        }
        
        // Return the error to be handled by the calling function (e.g., in useApiRequest)
        return Promise.reject(error);
    }
);

// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.log(error)
//         // if (error.response?.data?.isAuthError) {
//         //     const { clearUser } = useAuthStore.getState();
//         //     const { openModal } = useAuthModalStore.getState()
//         //     clearUser();
//         //     window.location.href = "/";
//         //     openModal("login")
//         // }
//         if (error.response?.status === 401) {
//             const { clearUser } = useAuthStore.getState();
//             const { openModal } = useAuthModalStore.getState()
//             clearUser();
//             openModal("login")
//         }

//         return Promise.reject(error);
//     }
// );

const adminLogin = (data) => axiosClient.post("/auth/login", data);
const logout = () => axiosClient.get("/auth/logout");


const createProject = (formData) => axiosClient.post("/projects", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

const getAllProjects = (params) => axiosClient.get("/projects", { params });
const getProjectBySlug = (slug) => axiosClient.get(`/projects/slug/${slug}`);
const updateProject = (id, formData) => axiosClient.patch(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // <-- هذا هو التعديل المهم
});const deleteProject = (id) => axiosClient.delete(`/projects/${id}`);
const getProjectById = (id) => axiosClient.get(`/projects/${id}`);
const getFeaturedMedia = (params) => axiosClient.get("/projects/featured", { params });


const getPublicProfile = () => axiosClient.get("/users/profile");
const getMyProfile = () => axiosClient.get("/users/me");
const updateMyProfile = (formData) => axiosClient.patch("/users/me", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
const createBooking = (data) => axiosClient.post("/bookings", data);

const getAllBookings = (params) => axiosClient.get("/bookings", { params });

const updateBookingStatus = (id, payload) => axiosClient.patch(`/bookings/${id}`, payload);

const deleteBooking = (id) => axiosClient.delete(`/bookings/${id}`);

const getBookingByTrackingId = (trackingId) => axiosClient.get(`/bookings/status/${trackingId}`);

const getDashboardStats = () => axiosClient.get("/dashboard/stats");

const getBookingActivity = () => axiosClient.get("/dashboard/booking-activity");


const getPublicTestimonials = (params) => axiosClient.get("/testimonials", { params });


const getAllTestimonials = (params) => axiosClient.get("/testimonials/all", { params });


const createTestimonial = (formData) => axiosClient.post("/testimonials", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

const updateTestimonial = (id, formData) => axiosClient.patch(`/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
const deleteTestimonial = (id) => axiosClient.delete(`/testimonials/${id}`);


// --- Messages ---
const createMessage = (data) => axiosClient.post("/messages", data);
const getAllMessages = (params) => axiosClient.get("/messages", { params });
const updateMessage = (id, data) => axiosClient.patch(`/messages/${id}`, data);
const deleteMessage = (id) => axiosClient.delete(`/messages/${id}`);
const replyToMessage = (id, data) => axiosClient.post(`/messages/${id}/reply`, data);

export default {
  adminLogin,
  logout,
  createProject,
  getAllProjects,
  getProjectBySlug,
  updateProject,
  deleteProject,
  getProjectById,
  getPublicProfile,
  getMyProfile,
  updateMyProfile,
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
  getBookingActivity,
  getBookingByTrackingId,
  getFeaturedMedia,
  getPublicTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
  replyToMessage
};
