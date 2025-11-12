import type { AxiosInstance } from "axios";

import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
// export const API_URL = `https://nasiya-server.onrender.com/api`;
// export const API_URL = `https://joylinks-backend.uz/api`;

const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;
