import { createSlice } from '@reduxjs/toolkit';

const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    amount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    fetchIncomeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIncomeSuccess: (state, action) => {
      state.loading = false;
      state.amount = action.payload;
    },
    fetchIncomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setIncomeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setIncomeSuccess: (state, action) => {
      state.loading = false;
      state.amount = action.payload;
    },
    setIncomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchIncomeRequest,
  fetchIncomeSuccess,
  fetchIncomeFailure,
  setIncomeRequest,
  setIncomeSuccess,
  setIncomeFailure,
} = incomeSlice.actions;

export default incomeSlice.reducer;