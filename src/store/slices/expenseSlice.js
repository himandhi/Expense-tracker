import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
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
  deleteExpenseRequest,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} = expenseSlice.actions;

export default expenseSlice.reducer;