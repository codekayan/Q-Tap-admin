// src/api/axios.js
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useAuthStore } from "../../store/zustand-store/authStore";

const userApi = axios.create({
  baseURL: BASE_URL, // ✅ replace with your API base URL
  timeout: 10000, // optional
  headers: {
    "Content-Type": "application/json",
  },
});

// Example of request interceptor (optional)
userApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = useAuthStore.getState().userData?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example of response interceptor (optional)
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    if (error.response?.status === 401) {
      console.log("Unauthorized, logging out...");
      // logout logic
    }
    return Promise.reject(error);
  }
);

export default userApi;
