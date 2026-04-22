// ============================================================
// FILE: src/services/api.js
// PURPOSE: Central API service — all backend calls go through here
//
// NEW CONCEPT: Axios
// Axios is a library for making HTTP requests (GET, POST, PUT, DELETE)
// to your backend. It's like fetch() but with better error handling
// and automatic JSON parsing.
//
// baseURL means all requests start with http://localhost:3000
// So API.get('/expenses') actually calls http://localhost:3000/expenses
// ============================================================

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// ── AUTH APIs ──

// Register a new user
// Sends: { email, password } → Returns: { message, userId }
export const registerUser = (email, password) => {
  return API.post("/auth/register", { email, password });
};

// Login a user
// Sends: { email, password } → Returns: { message, userId, email }
export const loginUser = (email, password) => {
  return API.post("/auth/login", { email, password });
};

// ── EXPENSE APIs ──

// Get all expenses for a user
export const getExpenses = (userId) => {
  return API.get(`/expenses?userId=${userId}`);
};

// Add a new expense
export const addExpense = (userId, name, cost) => {
  return API.post(`/expenses?userId=${userId}`, { name, cost });
};

// Delete an expense
export const deleteExpense = (expenseId, userId) => {
  return API.delete(`/expenses/${expenseId}?userId=${userId}`);
};

// ── INCOME APIs ──

// Get income for a user
export const getIncome = (userId) => {
  return API.get(`/income?userId=${userId}`);
};

// Set/update income for a user
export const setIncome = (userId, amount) => {
  return API.post(`/income?userId=${userId}`, { amount });
};

export default API;