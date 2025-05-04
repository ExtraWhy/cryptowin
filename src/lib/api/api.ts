export const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8081';
export const AUTH_BASE_URL = process.env.AUTH_URL || 'http://localhost:8080';
export const FRONTEND_HOST = process.env.FRONTEND_URL || 'http://localhost:3000';
export const WS_URL = process.env.WS_URL || 'ws://127.0.0.1:8081/ws';

export const LOGIN_ROUTES = {
  LOGIN_GOOGLE: `${AUTH_BASE_URL}/auth/google/login?callback-url=${FRONTEND_HOST}`,
  LOGIN_FACEBOOK: `${AUTH_BASE_URL}/auth/facebook/login?callback-url=${FRONTEND_HOST}`,
  LOGIN_APPLE: `${AUTH_BASE_URL}/auth/apple/login`,
};
