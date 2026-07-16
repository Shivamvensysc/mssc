import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 FIX: Handle FormData properly
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      return config;
    }

    // For non-FormData, ensure Content-Type is JSON
    if (config.data && typeof config.data === 'object') {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;