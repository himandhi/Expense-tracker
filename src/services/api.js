// ============================================================
// FILE: src/services/api.js
// FIXED: Interceptor no longer retries auth endpoints (/auth/login,
//        /auth/register) on 401 — prevents infinite refresh loop
// ============================================================

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ─────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
//
// PROBLEM BEFORE:
// When login fails with 401, the interceptor was catching it
// and trying to call /auth/refresh — which also fails with 401
// — which triggers the interceptor again — infinite loop!
// The saga's catch block never ran because the interceptor
// kept intercepting the error.
//
// FIX:
// Skip the refresh logic for auth endpoints (/auth/login,
// /auth/register, /auth/refresh) — let their errors go directly
// to the saga's catch block unchanged.
// ─────────────────────────────────────────────────────────────

// List of URLs that should NEVER trigger the refresh flow
const AUTH_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

API.interceptors.response.use(
  // Success handler — just return the response as-is
  (response) => response,

  // Error handler
  async (error) => {
    const originalRequest = error.config;

    // Get the URL path (without base URL)
    const requestUrl = originalRequest?.url || "";

    // CHECK 1: Is this an auth endpoint? If yes, skip refresh logic
    // Let the error go straight to the saga's catch block
    const isAuthEndpoint = AUTH_URLS.some((url) =>
      requestUrl.includes(url)
    );

    if (isAuthEndpoint) {
      // Just reject the error — saga will catch it and dispatch loginFailure
      return Promise.reject(error);
    }

    // CHECK 2: Is it a 401 and we haven't retried yet?
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await API.post("/auth/refresh");

        // Retry the original request with new token
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear storage and redirect to login
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────────────────────────

export const registerUser = (email, password, username) => {
  return API.post("/auth/register", { email, password, username });
};

export const loginUser = (email, password) => {
  return API.post("/auth/login", { email, password });
};

export const logoutUser = () => {
  return API.post("/auth/logout");
};

export const refreshToken = () => {
  return API.post("/auth/refresh");
};

export const getProfile = () => {
  return API.get("/auth/profile");
};

export const updateProfile = (data) => {
  return API.put("/auth/profile", data);
};

// ─────────────────────────────────────────────────────────────
// EXPENSE APIs (userId comes from JWT cookie — no param needed)
// ─────────────────────────────────────────────────────────────

export const getExpenses = () => {
  return API.get("/expenses");
};

export const addExpense = (name, cost) => {
  return API.post("/expenses", { name, cost });
};

export const updateExpense = (expenseId, data) => {
  return API.put(`/expenses/${expenseId}`, data);
};

export const deleteExpense = (expenseId) => {
  return API.delete(`/expenses/${expenseId}`);
};

// ─────────────────────────────────────────────────────────────
// INCOME APIs
// ─────────────────────────────────────────────────────────────

export const getIncome = () => {
  return API.get("/income");
};

export const setIncome = (amount) => {
  return API.post("/income", { amount });
};

// ─────────────────────────────────────────────────────────────
// ADMIN APIs
// ─────────────────────────────────────────────────────────────

export const adminGetOverview = () => {
  return API.get("/admin/overview");
};

export const adminGetUsers = () => {
  return API.get("/admin/users");
};

export const adminGetExpenses = () => {
  return API.get("/admin/expenses");
};

export const adminDeleteUser = (userId) => {
  return API.delete(`/admin/users/${userId}`);
};

export const adminUpdateUser = (userId, data) => {
  return API.put(`/admin/users/${userId}`, data);
};

export const adminDeleteExpense = (expenseId) => {
  return API.delete(`/admin/expenses/${expenseId}`);
};

export default API;