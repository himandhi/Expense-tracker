// ============================================================
// FILE: src/store/slices/expenseSlice.js
// UPDATED: Added updateExpense actions for edit functionality
// ============================================================

import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Fetch expenses
    fetchExpensesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchExpensesSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchExpensesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add expense
    addExpenseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addExpenseSuccess: (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    },
    addExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // NEW: Update expense
    updateExpenseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateExpenseSuccess: (state, action) => {
      state.loading = false;
      // Find the expense by id and replace it with the updated one
      // action.payload is the updated expense returned from the backend
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete expense
    deleteExpenseRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteExpenseSuccess: (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    deleteExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchExpensesRequest,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  addExpenseRequest,
  addExpenseSuccess,
  addExpenseFailure,
  updateExpenseRequest,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpenseRequest,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} = expenseSlice.actions;

export default expenseSlice.reducer;