// ============================================================
// FILE: src/store/sagas/authSaga.js
// UPDATED:
// 1. Store username and role in localStorage on login
// 2. Pass username and role to loginSuccess action
// 3. Pass username in register call (optional username field)
// ============================================================

import { call, put, takeLatest } from 'redux-saga/effects';
import { loginUser, registerUser } from '../../services/api';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from '../slices/authSlice';

function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(loginUser, email, password);

    // CHANGED: Also store username and role in localStorage
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('userEmail', response.data.email);
    localStorage.setItem('username', response.data.username || '');
    localStorage.setItem('role', response.data.role || 'user');

    // CHANGED: Pass full response data including username and role
    yield put(loginSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed. Please try again.';
    yield put(loginFailure(message));
  }
}

function* handleRegister(action) {
  try {
    // CHANGED: Also pass username if provided
    const { email, password, username } = action.payload;
    yield call(registerUser, email, password, username);
    yield put(registerSuccess());
  } catch (error) {
    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';
    yield put(registerFailure(message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}