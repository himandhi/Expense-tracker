// ============================================================
// FILE: src/pages/ForgotPasswordPage.jsx
// PURPOSE: Reset Password page — matching reference image
// TECH: React + Material UI + styled-components + Formik + Yup
//
// THIS PAGE IS SIMPLER THAN LOGIN/REGISTER:
// - Only ONE field (Email)
// - One button (Send Password Reset Link)
// - One link (Back → goes to Login)
// ============================================================

import React, { useState } from "react";
// ↑ NEW: We import useState here to show a success message
//   after the user submits the form.

import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// Same pattern as Login and Register pages.
// You'll notice these are reused — later you can move them
// to a shared file like src/styles/AuthStyles.js
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

const ResetCard = styled.div`
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

const BackLinkWrapper = styled.div`
  margin-top: 12px;

  @media (max-width: 400px) {
    text-align: left;
  }
`;

// ── Success message styled component ──
// NEW CONCEPT: This only appears AFTER the form is submitted.
// We use useState to toggle its visibility.
const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 16px;
  text-align: center;
`;

// ─────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
// Only email is needed — simpler than Login/Register
// ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

// ─────────────────────────────────────────────────────────────
// THE FORGOT PASSWORD COMPONENT
//
// NEW CONCEPT: Success state
// After the user submits, we show a green success message
// instead of navigating away. This is common for "reset
// password" flows — the user stays on the page and sees
// confirmation that the email was sent.
// ─────────────────────────────────────────────────────────────

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // State to track if the form was submitted successfully
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Password reset requested for:", values.email);

      // Show success message
      // In a real app, you'd call your backend API here to
      // send the actual reset email, then show this message.
      setSubmitted(true);
    },
  });

  return (
    <PageWrapper>
      <ResetCard>
        {/* ── HEADING ── */}
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
          Reset Password
        </Typography>

        {/* 
          NEW CONCEPT: Conditional rendering with &&
          
          {submitted && <SuccessMessage>...</SuccessMessage>}
          
          This is a shorthand for: if submitted is true, show the message.
          Unlike the ternary (condition ? a : b), the && operator
          only shows something when true — nothing when false.
        */}
        {submitted && (
          <SuccessMessage>
            Password reset link has been sent to your email!
          </SuccessMessage>
        )}

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

          {/* ── SUBMIT BUTTON ── */}
          <StyledButton
            type="submit"
            variant="contained"
            disableElevation
          >
            Send Password Reset Link
          </StyledButton>

          {/* ── BACK LINK ── */}
          <BackLinkWrapper>
            <Link
              href="/login"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
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
      </ResetCard>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;