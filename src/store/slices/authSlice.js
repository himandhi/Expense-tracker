import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    userEmail: localStorage.getItem('userEmail') || null,
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