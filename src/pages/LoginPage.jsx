// ============================================================
// FILE: src/pages/LoginPage.jsx
// PURPOSE: Login page — with React Router navigation
// UPDATED: onSubmit now navigates to /home
// ============================================================

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d4d4d4;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background-color: #b0b0b0;
  border: 1px solid #b8b8b8;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

  @media (max-width: 600px) {
    padding: 32px 24px;
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

      fieldset {
        border-color: #cccccc;
      }

      &:hover fieldset {
        border-color: #1a8fb5;
      }

      &.Mui-focused fieldset {
        border-color: #1a8fb5;
        border-width: 2px;
      }
    }

    .MuiInputLabel-root {
      color: #333333;
      font-size: 0.95rem;
    }

    .MuiInputLabel-root.Mui-focused {
      color: #333333;
    }

    .MuiOutlinedInput-input {
      color: #000000;
    }

    @media (max-width: 600px) {
      .MuiOutlinedInput-root {
        font-size: 0.9rem;
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

    &:hover {
      background-color: #0d6d8a;
    }

    &:disabled {
      background-color: #7ec4d9;
      color: #ffffff;
    }

    @media (max-width: 600px) {
      padding: 14px;
    }
  }
`;

const LinksRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  @media (max-width: 400px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
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
// THE LOGIN COMPONENT
// ─────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,

    // ── CHANGED: Navigate to home page instead of showing alert ──
    // Before:  alert(`Login attempt:\nEmail: ${values.email}`);
    // After:   navigate("/home");
    // Later when you add a backend, you'll first call your API
    // to verify credentials, and only navigate on success.
    onSubmit: (values) => {
      console.log("Login submitted with:", values);
      navigate("/home");
    },
  });

  return (
    <PageWrapper>
      <LoginCard>
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
          Login
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <StyledTextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <StyledTextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <StyledButton
            type="submit"
            variant="contained"
            disableElevation
          >
            Sign In
          </StyledButton>

          <LinksRow>
            <Link
              href="/register"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              sx={{
                color: "#333333",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Create Account
            </Link>

            <Link
              href="/forgot-password"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
              sx={{
                color: "#333333",
                fontSize: "0.85rem",
                fontWeight: 400,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password
            </Link>
          </LinksRow>
        </Box>
      </LoginCard>
    </PageWrapper>
  );
};

export default LoginPage;