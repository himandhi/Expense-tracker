import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    // Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.email;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Register
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

    // Logout
    logout: (state) => {
      state.userId = null;
      state.userEmail = null;
    },

    // Clear errors
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