import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const AUTH_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthEndpoint = AUTH_URLS.some((url) =>
      requestUrl.includes(url)
    );

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch (refreshError) {
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

export const getIncome = () => {
  return API.get("/income");
};

export const setIncome = (amount) => {
  return API.post("/income", { amount });
};

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