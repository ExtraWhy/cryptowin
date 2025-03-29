export const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080';
export const FRONTEND_HOST = process.env.FRONTEND_URL || 'http://localhost:3000';

export const LOGIN_ROUTES = {
  LOGIN_GOOGLE: `${API_BASE_URL}/auth/google/login?callback-url=${FRONTEND_HOST}`,
  LOGIN_FACEBOOK: `${API_BASE_URL}/auth/facebook/login?callback-url=${FRONTEND_HOST}`,
  LOGIN_APPLE: `${API_BASE_URL}/auth/apple/login`,
};
