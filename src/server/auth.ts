import axios from "axios";

import axiosInstance, { API_URL } from "./api";

const authApi = axios.create({
  withCredentials: true, // Cookie'larni yuborish uchun
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor: Tokenni qo'shish
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Tokenni yangilash
authApi.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    // Refresh endpoint uchun interceptor ishlamasligi kerak (loop oldini olish)
    if (originalRequest.url?.includes("/auth/refresh")) {
      // console.log("❌ Refresh endpoint failed, not retrying"); // Debug log o'chirildi
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      // ✅ localStorage'da token bor bo'lsa, refresh API'ga murojaat qilmaslik
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("⚠️ 401 error but token exists in localStorage - using cached token");
        originalRequest.headers.Authorization = `Bearer ${token}`;
        // Original request'ni qayta yuborish (cached token bilan)
        return await authApi.request(originalRequest);
      }

      // Faqat localStorage'da token yo'q bo'lsa refresh API'ga murojaat qilish
      try {
        console.log("🔄 Token expired, attempting refresh...");

        // Refresh uchun alohida axios instance yaratish (loop oldini olish)
        const refreshResponse = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true, // Cookie yuborish
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (refreshResponse.data.accessToken) {
          console.log("✅ Token refreshed successfully");
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return await authApi.request(originalRequest);
        }
      } catch (refreshError: any) {
        console.log("❌ Refresh token failed, using cached data");
        // Xatolik xabarlarini qisqartirish
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
