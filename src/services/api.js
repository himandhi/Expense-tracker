import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});


export const registerUser = (email, password) => {
  return API.post("/auth/register", { email, password });
};


export const loginUser = (email, password) => {
  return API.post("/auth/login", { email, password });
};


export const getExpenses = (userId) => {
  return API.get(`/expenses?userId=${userId}`);
};


export const addExpense = (userId, name, cost) => {
  return API.post(`/expenses?userId=${userId}`, { name, cost });
};


export const deleteExpense = (expenseId, userId) => {
  return API.delete(`/expenses/${expenseId}?userId=${userId}`);
};


export const getIncome = (userId) => {
  return API.get(`/income?userId=${userId}`);
};


export const setIncome = (userId, amount) => {
  return API.post(`/income?userId=${userId}`, { amount });
};

export default API;