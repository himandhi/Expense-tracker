// ============================================================
// FILE: src/pages/RegisterPage/RegisterPage.jsx
// UPDATED: Now uses Redux Saga instead of direct API calls
//
// WHAT CHANGED:
// Before: import { registerUser } from "../../services/api"
//         await registerUser(values.email, values.password)
//
// After:  import { useDispatch, useSelector } from "react-redux"
//         dispatch(registerRequest({ email, password }))
//         The saga handles the API call in the background
// ============================================================

import React, { useEffect } from "react";
// ↑ CHANGED: Removed useState (error/success now come from Redux)
//            Added useEffect (to watch for registerSuccess)

import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// NEW: Redux imports replace direct API import
import { useDispatch, useSelector } from "react-redux";
import {
  registerRequest,
  clearError,
} from "../../store/slices/authSlice";

// REMOVED: import { registerUser } from "../../services/api";
// The saga now calls registerUser internally

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d4d4d4;

  @media (max-width: 600px) {
    background-color: #ffffff;
    align-items: flex-start;
    padding-top: 60px;
  }
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background-color: #b0b0b0;
  border: 1px solid #b8b8b8;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

  @media (max-width: 600px) {
    background-color: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0 24px;
    max-width: 100%;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 12px;
    background-color: #ffffff;
    border-radius: 8px;

    .MuiOutlinedInput-root {
      background-color: #ffffff;
      border-radius: 8px;
      fieldset { border-color: #cccccc; }
      &:hover fieldset { border-color: #1a8fb5; }
      &.Mui-focused fieldset { border-color: #1a8fb5; border-width: 2px; }
    }

    .MuiInputLabel-root { color: #333333; font-size: 0.95rem; }
    .MuiInputLabel-root.Mui-focused { color: #333333; }
    .MuiOutlinedInput-input { color: #000000; }

    @media (max-width: 600px) {
      background-color: #f0f0f0;
      .MuiOutlinedInput-root {
        background-color: #f0f0f0;
        fieldset { border-color: #e0e0e0; }
      }
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    width: 100%;
    padding: 12px;
    background-color: #1a8fb5;
    color: #ffffff;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    border-radius: 8px;
    margin-top: 12px;
    &:hover { background-color: #0d6d8a; }
    &:disabled { background-color: #7ec4d9; color: #ffffff; }
  }
`;

const BackLinkWrapper = styled.div`
  margin-top: 12px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
`;

// ─────────────────────────────────────────────────────────────
// VALIDATION (unchanged)
// ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// ─────────────────────────────────────────────────────────────
// THE REGISTER COMPONENT
// ─────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const navigate = useNavigate();

  // NEW: Get dispatch function and Redux state
  const dispatch = useDispatch();
  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  // REMOVED: const [error, setError] = useState("");
  // REMOVED: const [success, setSuccess] = useState("");
  // Error and success now come from Redux store

  // NEW: Clear errors when page first loads
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // NEW: When registration succeeds, redirect to login after 2 seconds
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      // Cleanup: cancel timer if component unmounts before 2 seconds
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,

    // CHANGED: Dispatch action instead of calling API directly
    // Before: await registerUser(values.email, values.password)
    // After:  dispatch(registerRequest({ ... }))
    onSubmit: (values) => {
      dispatch(
        registerRequest({
          email: values.email,
          password: values.password,
        })
      );
    },
    // REMOVED: async, try-catch, setError, setSuccess
    // The saga handles all of that now
  });

  return (
    <PageWrapper>
      <RegisterCard>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "#2c2c2c",
            fontWeight: 700,
            fontStyle: "normal",
            marginBottom: "28px",
          }}
        >
          Register
        </Typography>

        {/* Error and success now read from Redux state */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {registerSuccess && (
          <SuccessMessage>
            Registration successful! Redirecting to login...
          </SuccessMessage>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <StyledTextField
            fullWidth id="email" name="email" label="Email"
            type="email" variant="outlined" size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <StyledTextField
            fullWidth id="password" name="password" label="Password"
            type="password" variant="outlined" size="small"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* NEW: Button disabled while loading */}
          <StyledButton
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </StyledButton>

          <BackLinkWrapper>
            <Link
              href="/login" underline="none"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
              sx={{ color: "#333333", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Back
            </Link>
          </BackLinkWrapper>
        </Box>
      </RegisterCard>
    </PageWrapper>
  );
};

export default RegisterPage;