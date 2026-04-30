import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000";
const baseURL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
const TOKEN_KEY = "bookswap.accessToken";
const getToken = () => localStorage.getItem(TOKEN_KEY);
const normalizeToken = (token) => {
  if (!token || token === "undefined" || token === "null") {
    return "";
  }
  return token;
};

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  const normalized = normalizeToken(token);
  if (normalized) {
    api.defaults.headers.common.Authorization = `Bearer ${normalized}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const persistAuthToken = (token) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeToken(token);
  if (normalized) {
    localStorage.setItem(TOKEN_KEY, normalized);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  setAuthToken(normalized);
  window.dispatchEvent(new Event("auth-token-changed"));
};


api.interceptors.request.use((config) => {
  const token = normalizeToken(getToken());
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
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
  me: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await api.put("/api/auth/profile", payload);
    return response.data;
  },
};

export const listingApi = {
  getAll: async (params = {}) => {
    const response = await api.get("/api/listing", { params });
    return response.data;
  },
  getMine: async () => {
    const response = await api.get("/api/listing/mine");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/listing/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post("/api/listing", payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/api/listing/${id}`);
    return response.data;
  },
};

export const bookApi = {
  getAll: async (params = {}) => {
    const response = await api.get("/api/books", { params });
    return response.data;
  },
  searchByTitle: async (query) => {
    const response = await api.get("/api/books/search/title", {
      params: { q: query },
    });
    return response.data;
  },
  searchByAuthor: async (query) => {
    const response = await api.get("/api/books/search/author", {
      params: { q: query },
    });
    return response.data;
  },
  searchByIsbn: async (query) => {
    const response = await api.get("/api/books/search/isbn", {
      params: { q: query },
    });
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post("/api/books", payload);
    return response.data;
  },
};

export const wishlistApi = {
  getAll: async () => {
    const response = await api.get("/api/wishlist");
    return response.data;
  },
  add: async (payload) => {
    const response = await api.post("/api/wishlist", payload);
    return response.data;
  },
  remove: async (bookId) => {
    const response = await api.delete(`/api/wishlist/${bookId}`);
    return response.data;
  },
};

export const collectionApi = {
  getAll: async () => {
    const response = await api.get("/api/collection");
    return response.data;
  },
  add: async (payload) => {
    const response = await api.post("/api/collection", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/api/collection/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/api/collection/${id}`);
    return response.data;
  },
};

export const tradeRequestApi = {
  create: async (payload) => {
    const response = await api.post("/api/trade-requests", payload);
    return response.data;
  },
  getIncoming: async () => {
    const response = await api.get("/api/trade-requests/incoming");
    return response.data;
  },
  getOutgoing: async () => {
    const response = await api.get("/api/trade-requests/outgoing");
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/api/trade-requests");
    return response.data;
  },
};

export const messageApi = {
  getByTradeRequest: async (tradeRequestId) => {
    const response = await api.get(`/api/messages/trade-request/${tradeRequestId}`);
    return response.data;
  },
  send: async (payload) => {
    const response = await api.post("/api/messages", payload);
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
