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

function* handleFetchExpenses(action) {
  try {
    const response = yield call(getExpenses, action.payload);
    yield put(fetchExpensesSuccess(response.data));
  } catch {
    yield put(fetchExpensesFailure('Failed to fetch expenses'));
  }
}

function* handleAddExpense(action) {
  try {
    const { userId, name, cost } = action.payload;
    const response = yield call(addExpense, userId, name, cost);
    yield put(addExpenseSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to add expense';
    yield put(addExpenseFailure(message));
  }
}

function* handleDeleteExpense(action) {
  try {
    const { expenseId, userId } = action.payload;
    yield call(deleteExpense, expenseId, userId);
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