// ============================================================
// FILE: src/store/slices/authSlice.js
// UPDATED:
// 1. Added username and role to initial state
// 2. loginSuccess now saves username and role
// 3. logout now clears username and role too
// ============================================================

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    // NEW: Load username and role from localStorage on app start
    // This means if the user refreshes the page, they stay logged in
    // with their username visible — no need to fetch from backend again
    username: localStorage.getItem('username') || null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // CHANGED: Now also saves username and role from response
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.email;
      state.username = action.payload.username || null;
      state.role = action.payload.role || 'user';
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.registerSuccess = false;
    },

    registerSuccess: (state) => {
      state.loading = false;
      state.registerSuccess = true;
      state.error = null;
    },

    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.registerSuccess = false;
    },

    // CHANGED: Also clears username and role on logout
    logout: (state) => {
      state.userId = null;
      state.userEmail = null;
      state.username = null;
      state.role = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;