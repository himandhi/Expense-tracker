// ============================================================
// FILE: src/pages/RegisterPage.jsx
// PURPOSE: Register page — matching the reference image
// TECH: React + Material UI + styled-components + Formik + Yup
// ============================================================

// ─────────────────────────────────────────────────────────────
// STEP 1: IMPORTS
// Same imports as LoginPage — you already know these!
// ─────────────────────────────────────────────────────────────

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import styled from "styled-components";

// NEW IMPORT: useNavigate from React Router
// This lets us navigate to other pages programmatically
// (e.g., clicking "Back" takes us to the login page)
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// STEP 2: STYLED COMPONENTS
// These are the SAME styles as LoginPage.
// 
// TIP FOR LATER: When you see duplicate code like this,
// you can move shared styles to a separate file like
// src/styles/SharedStyles.js and import them in both pages.
// For now, keeping them here makes it easier to learn.
// ─────────────────────────────────────────────────────────────

// --- PageWrapper: Full-page grey background ---
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

// --- RegisterCard: The grey container with rounded corners ---
const RegisterCard = styled.div`
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

// --- StyledTextField: White input with rounded corners ---
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

// --- StyledButton: Blue Register button with rounded corners ---
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

// --- BackLink: Container for the "Back" link ---
// DIFFERENCE FROM LOGIN: Only one link (no "Forgot password")
// so we use align-items: flex-start to push it to the left
const BackLinkWrapper = styled.div`
  margin-top: 12px;

  @media (max-width: 400px) {
    text-align: left;
  }
`;

// ─────────────────────────────────────────────────────────────
// STEP 3: VALIDATION SCHEMA (Yup)
// 
// NEW CONCEPT: Confirm Password validation
// We use Yup.ref('password') to check that confirmPassword
// matches the password field. This is called "cross-field
// validation" — one field's rule depends on another field.
// ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  // NOTE: The reference image only shows Email and Password fields.
  // But for a real register form, you'd typically also have a
  // "Confirm Password" field. I'm keeping it as the image shows
  // (just Email + Password), but here's how you'd add it later:
  //
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm Password is required'),
});

// ─────────────────────────────────────────────────────────────
// STEP 4: THE REGISTER COMPONENT
//
// NEW CONCEPTS IN THIS COMPONENT:
// 1. useNavigate() — React Router hook for page navigation
// 2. navigate("/login") — programmatic navigation (no page reload)
// ─────────────────────────────────────────────────────────────

const RegisterPage = () => {
  // --- useNavigate: gives us a function to change pages ---
  // navigate("/login") will take us to the login page
  // WITHOUT refreshing the browser (this is called "client-side routing")
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Register submitted with:", values);
      alert(`Registration attempt:\nEmail: ${values.email}`);

      // After successful registration, navigate to login page
      // In a real app, you'd first send data to your backend API,
      // wait for success, THEN navigate.
      // navigate("/login");
    },
  });

  return (
    <PageWrapper>
      <RegisterCard>
        {/* ── HEADING: "Register" (bold, not italic) ── */}
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

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          {/* ── EMAIL FIELD ── */}
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

          {/* ── PASSWORD FIELD ── */}
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

          {/* ── REGISTER BUTTON ── */}
          <StyledButton
            type="submit"
            variant="contained"
            disableElevation
          >
            Register
          </StyledButton>

          {/* ── BACK LINK ── */}
          {/* 
            NEW CONCEPT: onClick with navigate()
            Instead of using href="/login" (which causes a full page reload),
            we use onClick + navigate() for client-side navigation.
            This is FASTER because React only updates the component,
            not the entire page.
            
            e.preventDefault() stops the browser from following the href.
          */}
          <BackLinkWrapper>
            <Link
              href="/login"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                // ↑ Prevents the browser from doing a full page reload
                
                navigate("/login");
                // ↑ React Router changes the URL and renders LoginPage
                //   without reloading the browser — much faster!
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
              Back
            </Link>
          </BackLinkWrapper>
        </Box>
      </RegisterCard>
    </PageWrapper>
  );
};

export default RegisterPage;