import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000";
const baseURL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async (payload) => {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  },
  signup: async (payload) => {
    const response = await api.post("/api/auth/signup", payload);
    return response.data;
  },
};

export const listingApi = {
  getAll: async (params = {}) => {
    const response = await api.get("/api/listing", { params });
    return response.data;
  },
};

export const extractApiError = (error, fallbackMessage) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      fallbackMessage
    );
  }

  return fallbackMessage;
};

export default api;
