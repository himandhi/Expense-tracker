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

function* handleFetchIncome() {
  try {
    const response = yield call(getIncome);
    const amount = response.data ? Number(response.data.amount) : 0;
    yield put(fetchIncomeSuccess(amount));
  } catch {
    yield put(fetchIncomeFailure('Failed to fetch income'));
  }
}

function* handleSetIncome(action) {
  try {
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