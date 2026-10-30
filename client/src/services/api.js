
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to protected API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const donorAPI = {
  list: (params = {}) => api.get("/donors", { params }),
  get: (id) => api.get(`/donors/${id}`),
  create: (data) => api.post("/donors", data),
  update: (id, data) => api.patch(`/donors/${id}`, data),
  remove: (id) => api.delete(`/donors/${id}`),
};

export default api;

export const resourceAPI = {
  list: (resource) => api.get(`/manage/${resource}`),
  create: (resource, data) => api.post(`/manage/${resource}`, data),
  update: (resource, id, data) => api.patch(`/manage/${resource}/${id}`, data),
  remove: (resource, id) => api.delete(`/manage/${resource}/${id}`),
  toggle: (resource, id) => api.patch(`/manage/${resource}/${id}/status`),
};
