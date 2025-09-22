// src/utils/constants.js

// Base URL for backend API (no `/api` since backend routes are mounted directly)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const STORAGE_KEYS = {
  TOKEN: 'rlaas_token',
  USER: 'rlaas_user'
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',

  // Projects
  PROJECTS: '/projects',
  PROJECT_LIMITS: (id) => `/projects/${id}/limits`,

  // Analytics
  USAGE: (projectId) => `/usage/${projectId}`,

  // Test
  TEST: '/test',
  
  // Check
  CHECK: '/check'
};

export const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
];

export const CHART_COLORS = {
  allowed: '#10B981',
  blocked: '#EF4444',
  total: '#3B82F6'
};
