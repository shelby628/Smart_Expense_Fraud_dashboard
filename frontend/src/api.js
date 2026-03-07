import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-expense-fraud-dashboard.onrender.com/api/",
  withCredentials: true,
});

// Automatically refresh token if access token expires
API.interceptors.response.use(
  (response) => response, // if request is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint — backend sets new access cookie automatically
        await API.post("token/refresh/");

        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired — send user to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;