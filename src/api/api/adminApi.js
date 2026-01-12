// src/api/axios.js
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const adminApi = axios.create({
  baseURL: BASE_URL, // ✅ replace with your API base URL
  timeout: 10000, // optional
  headers: {
    "Content-Type": "application/json",
  },
});

// Example of request interceptor (optional)
adminApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example of response interceptor (optional)
adminApi.interceptors.response.use(
  (response) => { console.log(response); return response },
  (error) => {
    console.log(error);
    // Handle global errors
    if (error.response?.status === 401) {
      console.log("Unauthorized, logging out...");
      // logout logic
    }
    return Promise.reject(error);
  }
);

export default adminApi;
