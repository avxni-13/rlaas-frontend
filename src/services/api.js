import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls (removed .me since backend doesn’t support it)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Projects API calls
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (projectData) => api.post('/projects', projectData),
  updateLimits: (id, limits) => api.patch(`/projects/${id}/limits`, limits),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Analytics API calls
export const analyticsAPI = {
  getUsage: (projectId, timeRange = '24h') =>
    api.get(`/usage/${projectId}`, { params: { range: timeRange } }),
};

// Rate-limit check API
export const checkAPI = {
  validate: (apiKey) =>
    axios.post(`${API_BASE_URL}/check`, null, {
      headers: { Authorization: apiKey },
    }),
};

export default api;
