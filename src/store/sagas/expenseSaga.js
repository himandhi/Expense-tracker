// ============================================================
// FILE: src/store/sagas/expenseSaga.js
// UPDATED: Removed userId from all API calls
//
// BEFORE: API calls needed userId as a parameter
//   const { userId, name, cost } = action.payload;
//   yield call(addExpense, userId, name, cost);
//
// AFTER: No userId needed — JWT cookie sent automatically
//   const { name, cost } = action.payload;
//   yield call(addExpense, name, cost);
//
// The backend reads the userId from the JWT access token
// stored in the HTTP-only cookie, which the browser sends
// automatically with every request.
// ============================================================

import { call, put, takeLatest } from 'redux-saga/effects';
import { getExpenses, addExpense, deleteExpense } from '../../services/api';
import {
  fetchExpensesRequest,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  addExpenseRequest,
  addExpenseSuccess,
  addExpenseFailure,
  deleteExpenseRequest,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} from '../slices/expenseSlice';

// CHANGED: Removed action.payload (userId) — no userId needed anymore
function* handleFetchExpenses() {
  try {
    const response = yield call(getExpenses);
    yield put(fetchExpensesSuccess(response.data));
  } catch {
    yield put(fetchExpensesFailure('Failed to fetch expenses'));
  }
}

function* handleAddExpense(action) {
  try {
    // CHANGED: Removed userId from destructuring and from API call
    // Before: const { userId, name, cost } = action.payload;
    //         yield call(addExpense, userId, name, cost);
    // After:  const { name, cost } = action.payload;
    //         yield call(addExpense, name, cost);
    const { name, cost } = action.payload;
    const response = yield call(addExpense, name, cost);
    yield put(addExpenseSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to add expense';
    yield put(addExpenseFailure(message));
  }
}

function* handleDeleteExpense(action) {
  try {
    // CHANGED: Removed userId from destructuring and from API call
    // Before: const { expenseId, userId } = action.payload;
    //         yield call(deleteExpense, expenseId, userId);
    // After:  const { expenseId } = action.payload;
    //         yield call(deleteExpense, expenseId);
    const { expenseId } = action.payload;
    yield call(deleteExpense, expenseId);
    yield put(deleteExpenseSuccess(expenseId));
  } catch {
    yield put(deleteExpenseFailure('Failed to delete expense'));
  }
}

export default function* expenseSaga() {
  yield takeLatest(fetchExpensesRequest.type, handleFetchExpenses);
  yield takeLatest(addExpenseRequest.type, handleAddExpense);
  yield takeLatest(deleteExpenseRequest.type, handleDeleteExpense);
}