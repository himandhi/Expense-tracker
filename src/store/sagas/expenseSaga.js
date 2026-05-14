import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../../services/api';
import {
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
} from '../slices/expenseSlice';

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
    const { name, cost } = action.payload;
    const response = yield call(addExpense, name, cost);
    yield put(addExpenseSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to add expense';
    yield put(addExpenseFailure(message));
  }
}

function* handleUpdateExpense(action) {
  try {
    const { expenseId, name, cost } = action.payload;
    const response = yield call(updateExpense, expenseId, { name, cost });
    yield put(updateExpenseSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to update expense';
    yield put(updateExpenseFailure(message));
  }
}

function* handleDeleteExpense(action) {
  try {
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
  yield takeLatest(updateExpenseRequest.type, handleUpdateExpense);
  yield takeLatest(deleteExpenseRequest.type, handleDeleteExpense);
}