import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:9000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const registerUser = (email: string, password: string, name?: string) =>
  api.post("/auth/register", { email, password, name });

export const getProjects = (page = 1, limit = 10) =>
  api.get("/projects/list", { params: { page, limit } });

export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: { title: string; description?: string; status?: string }) =>
  api.post("/projects/create", data);
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);


export const getTasks = (projectId: string, status?: string, page = 1, limit = 10) =>
  api.get(`/projects/${projectId}/tasks`, { params: { status, page, limit } });
export const createTask = (projectId: string, data: any) =>
  api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (id: string, data: any) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
