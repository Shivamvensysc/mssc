import api from "./api";

let redirecting = false;

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearSession();

      if (!redirecting) {
        redirecting = true;

        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;