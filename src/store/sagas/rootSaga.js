import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import expenseSaga from './expenseSaga';
import incomeSaga from './incomeSaga';

export default function* rootSaga() {
  yield all([authSaga(), expenseSaga(), incomeSaga()]);
}