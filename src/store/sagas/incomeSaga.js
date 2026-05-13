// ============================================================
// FILE: src/store/sagas/incomeSaga.js
// UPDATED: Removed userId from all API calls
//
// BEFORE: API calls needed userId as a parameter
//   yield call(getIncome, action.payload);        // action.payload was userId
//   const { userId, amount } = action.payload;
//   yield call(setIncome, userId, amount);
//
// AFTER: No userId needed — JWT cookie sent automatically
//   yield call(getIncome);
//   const { amount } = action.payload;
//   yield call(setIncome, amount);
// ============================================================

import { call, put, takeLatest } from 'redux-saga/effects';
import { getIncome, setIncome } from '../../services/api';
import {
  fetchIncomeRequest,
  fetchIncomeSuccess,
  fetchIncomeFailure,
  setIncomeRequest,
  setIncomeSuccess,
  setIncomeFailure,
} from '../slices/incomeSlice';

// CHANGED: Removed action parameter — no userId payload needed
function* handleFetchIncome() {
  try {
    // Before: yield call(getIncome, action.payload)  ← action.payload was userId
    // After:  yield call(getIncome)                  ← no arguments needed
    const response = yield call(getIncome);
    const amount = response.data ? Number(response.data.amount) : 0;
    yield put(fetchIncomeSuccess(amount));
  } catch {
    yield put(fetchIncomeFailure('Failed to fetch income'));
  }
}

function* handleSetIncome(action) {
  try {
    // CHANGED: Removed userId from destructuring and from API call
    // Before: const { userId, amount } = action.payload;
    //         yield call(setIncome, userId, amount);
    // After:  const { amount } = action.payload;
    //         yield call(setIncome, amount);
    const { amount } = action.payload;
    yield call(setIncome, amount);
    yield put(setIncomeSuccess(amount));
  } catch {
    yield put(setIncomeFailure('Failed to set income'));
  }
}

export default function* incomeSaga() {
  yield takeLatest(fetchIncomeRequest.type, handleFetchIncome);
  yield takeLatest(setIncomeRequest.type, handleSetIncome);
}