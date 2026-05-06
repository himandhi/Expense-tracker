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

// Worker saga: handles login API call
function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(loginUser, email, password);

    // Store in localStorage
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('userEmail', response.data.email);

    yield put(loginSuccess(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed. Please try again.';
    yield put(loginFailure(message));
  }
}

// Worker saga: handles register API call
function* handleRegister(action) {
  try {
    const { email, password } = action.payload;
    yield call(registerUser, email, password);
    yield put(registerSuccess());
  } catch (error) {
    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';
    yield put(registerFailure(message));
  }
}

// Watcher saga: watches for dispatched actions
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}