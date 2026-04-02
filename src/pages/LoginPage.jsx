
// FILE: src/components/LoginPage.jsx
// PURPOSE: The Login page — matching your reference image
// TECH: React + Material UI + styled-components + Formik + Yup

// ─────────────────────────────────────────────────────────────
// STEP 4a: IMPORTS
// We bring in everything we need from the libraries we installed
// ─────────────────────────────────────────────────────────────

import React from "react";
// ↑ React is the core library. Every component file needs this.

import { useFormik } from "formik";
// ↑ useFormik is a React "hook" from Formik.
//   Hooks are special functions that let us add features to components.
//   useFormik gives us: form values, error messages, submit handling.

import * as Yup from "yup";
// ↑ Yup is a validation library. We define rules like
//   "email must be valid" or "password is required".
//   The `* as Yup` syntax imports everything into one object.

import { Box, Typography, TextField, Button, Link } from "@mui/material";
// ↑ These are pre-built Material UI components:
//   Box        → A <div> with extra styling powers (like flexbox)
//   Typography → For text (headings, paragraphs) with consistent styling
//   TextField  → A styled input field with label, error states, etc.
//   Button     → A styled button with hover effects, ripple, etc.
//   Link       → A styled anchor tag for "Create Account", "Forgot password"

import styled from "styled-components";
// ↑ styled-components lets us write CSS directly in JavaScript.
//   We create custom components with built-in styles.

// ─────────────────────────────────────────────────────────────
// STEP 4b: STYLED COMPONENTS
// These are custom-styled wrappers using styled-components.
// Think of them as custom HTML elements with CSS baked in.
// ─────────────────────────────────────────────────────────────

// --- PageWrapper: The full-page background ---
// This covers the entire screen and centers the login card.
const PageWrapper = styled.div`
  /* Full viewport height and width */
  min-height: 100vh;
  width: 100%;

  /* Flexbox to center the card both horizontally and vertically */
  display: flex;
  justify-content: center; /* horizontal center */
  align-items: center; /* vertical center */

  /* Background color matching your image */
  background-color: #d4d4d4;

  /* 
    CSS MEDIA QUERY: Changes styles based on screen size.
    Below 600px (mobile phones), we add padding so the card
    doesn't touch the edges of the screen.
  */
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

// --- LoginCard: The grey container holding the form ---
// This is the card/box you see in your image.
const LoginCard = styled.div`
  /* Fixed width like in your image, with max-width for responsiveness */
  width: 100%;
  max-width: 450px;

  /* Padding inside the card (space between edge and content) */
  padding: 48px 40px;

  /* The grey background of the card */
  background-color: #b0b0b0;

  /* Subtle border to separate from background */
  border: 1px solid #c0c0c0;

  /* Very slight rounded corners */
  border-radius: 4px;

  /* Subtle shadow for depth */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  /*
    MEDIA QUERY: On mobile screens, reduce padding
    so content isn't squeezed too tight.
  */
  @media (max-width: 600px) {
    padding: 32px 24px;
    max-width: 100%;
  }
`;

// --- StyledTextField: Customized MUI TextField ---
// We override MUI's default TextField styles to match the image.
// The `&&` increases CSS specificity to override MUI defaults.
const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 16px; /* Space below each input */
    background-color: #ffffff; /* White input background */
    border-radius: 2px;

    /* Target the actual <input> element inside MUI's component */
    .MuiOutlinedInput-root {
      background-color: #ffffff;
      border-radius: 2px;

      /* Style the border */
      fieldset {
        border-color: #cccccc;
      }

      /* When user hovers over the input */
      &:hover fieldset {
        border-color: #1a8fb5;
      }

      /* When the input is focused (clicked into) */
      &.Mui-focused fieldset {
        border-color: #1a8fb5;
        border-width: 2px;
      }
    }

    /* Style the placeholder/label text */
    .MuiInputLabel-root {
      color: #777777;
      font-size: 0.95rem;
    }

    /*
      MEDIA QUERY: Slightly smaller font on mobile
    */
    @media (max-width: 600px) {
      .MuiOutlinedInput-root {
        font-size: 0.9rem;
      }
    }
  }
`;

// --- StyledButton: The blue "Sign In" button ---
const StyledButton = styled(Button)`
  && {
    /* Full width like in your image */
    width: 100%;

    /* Padding for comfortable click area */
    padding: 12px;

    /* The blue color from your image */
    background-color: #1a8fb5;

    /* White text on blue background */
    color: #ffffff;

    /* Make text slightly bold */
    font-weight: 600;
    font-size: 1rem;

    /* Remove default uppercase from MUI buttons */
    text-transform: none;

    /* Slight rounding */
    border-radius: 2px;

    /* Top margin to separate from password field */
    margin-top: 8px;

    /* Hover effect: darken the button */
    &:hover {
      background-color: #0d6d8a;
    }

    /* Disabled state: when form is submitting */
    &:disabled {
      background-color: #7ec4d9;
      color: #ffffff;
    }

    /*
      MEDIA QUERY: Slightly more padding on mobile for easier tapping
    */
    @media (max-width: 600px) {
      padding: 14px;
    }
  }
`;

// --- LinksRow: Container for "Create Account" and "Forgot password" ---
const LinksRow = styled.div`
  display: flex;
  justify-content: space-between; /* Push items to opposite ends */
  align-items: center;
  margin-top: 12px;

  /*
    MEDIA QUERY: On very small screens, stack them vertically
    and center them.
  */
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
`;

// ─────────────────────────────────────────────────────────────
// STEP 4c: VALIDATION SCHEMA (Yup)
// This defines the rules for each form field.
// If a rule fails, Yup provides an error message.
// ─────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  // --- Email field rules ---
  email: Yup.string()
    .email("Please enter a valid email address")
    // ↑ Checks format: must have @ and a domain (e.g., user@example.com)
    .required("Email is required"),
  // ↑ Field cannot be empty

  // --- Password field rules ---
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    // ↑ Minimum length check
    .required("Password is required"),
  // ↑ Field cannot be empty
});

// ─────────────────────────────────────────────────────────────
// STEP 4d: THE LOGIN COMPONENT
// This is our actual React component — a function that returns JSX.
// JSX looks like HTML but it's JavaScript under the hood.
// ─────────────────────────────────────────────────────────────

const LoginPage = () => {
  // --- useFormik hook: manages our form state ---
  // We pass it: initial values, validation rules, and what to do on submit.
  const formik = useFormik({
    // initialValues: what the form fields start with (empty strings)
    initialValues: {
      email: "",
      password: "",
    },

    // validationSchema: our Yup rules from above
    validationSchema: validationSchema,

    // onSubmit: function that runs when the form is valid and submitted
    onSubmit: (values) => {
      // `values` is an object like { email: "user@test.com", password: "123456" }
      // For now, we just log it. Later, you'll send this to a backend API.
      console.log("Login submitted with:", values);
      alert(`Login attempt:\nEmail: ${values.email}`);
    },
  });

  // --- The JSX (what gets rendered on screen) ---
  return (
    <PageWrapper>
      {/* The grey card container */}
      <LoginCard>
        {/* 
          Typography: MUI's text component.
          - variant="h4" → uses the h4 styles from our theme
          - component="h1" → renders as <h1> in HTML (good for accessibility)
          - gutterBottom → adds margin below
        */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "#2c2c2c",
            fontWeight: 700,
            fontStyle: "italic", // Italic like in your image
            marginBottom: "32px",
          }}
        >
          Login
        </Typography>

        {/* 
          Box with component="form": renders as <form> HTML element.
          - onSubmit={formik.handleSubmit} → connects Formik's submit handler
          - noValidate → disables browser's built-in validation (we use Formik/Yup)
        */}
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          {/* ── EMAIL FIELD ── */}
          <StyledTextField
            fullWidth
            // ↑ Makes the input take full width of its container

            id="email"
            // ↑ Unique identifier — connects label to input for accessibility

            name="email"
            // ↑ Must match the key in formik's initialValues

            label="Email"
            // ↑ The placeholder/floating label text

            type="email"
            // ↑ Tells the browser this is an email field (mobile shows @ keyboard)

            variant="outlined"
            // ↑ MUI style: shows a border around the input

            size="small"
            // ↑ Compact size to match your image

            value={formik.values.email}
            // ↑ Controlled input: React manages the value through formik

            onChange={formik.handleChange}
            // ↑ When user types, formik updates its internal state

            onBlur={formik.handleBlur}
            // ↑ When user clicks away, formik marks the field as "touched"
            //   This is important: we only show errors AFTER the user has
            //   interacted with the field (not immediately on page load).

            error={formik.touched.email && Boolean(formik.errors.email)}
            // ↑ error={true} makes the field border red.
            //   We only show error if:
            //   1. formik.touched.email → user has clicked into and out of field
            //   2. formik.errors.email → Yup found a validation error
            //   Boolean() converts the error string to true/false

            helperText={formik.touched.email && formik.errors.email}
            // ↑ Shows the error message text below the input.
            //   Only shows when touched AND there's an error.
            //   e.g., "Please enter a valid email address"
          />

          {/* ── PASSWORD FIELD ── */}
          <StyledTextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            // ↑ type="password" hides the characters as dots

            variant="outlined"
            size="small"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          {/* ── SIGN IN BUTTON ── */}
          <StyledButton
            type="submit"
            // ↑ type="submit" means clicking this triggers the <form>'s onSubmit

            variant="contained"
            // ↑ MUI button style: filled/solid background

            disableElevation
            // ↑ Removes the default shadow from MUI buttons
          >
            Sign In
          </StyledButton>

          {/* ── LINKS ROW: Create Account & Forgot Password ── */}
          <LinksRow>
            <Link
              href="/register"
              // ↑ Where this link goes. Later, you'll use React Router's <Link>

              underline="none"
              // ↑ Removes the underline from the link

              sx={{
                color: "#1a5276",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  // ↑ Show underline on hover for better UX
                },
              }}
            >
              Create Account
            </Link>

            <Link
              href="/forgot-password"
              underline="none"
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

// Export the component so App.jsx can use it
export default LoginPage;