import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, clearError } from "../../store/slices/authSlice";


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

const LoginCard = styled.div`
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

const LinksRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});


const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, userId } = useSelector((state) => state.auth);


  useEffect(() => {
    if (userId) {
      navigate("/home");
    }
  }, [userId, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(loginRequest({ email: values.email, password: values.password }));
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

        {error && <ErrorMessage>{error}</ErrorMessage>}

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

          <StyledButton
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </StyledButton>

          <LinksRow>
            <Link
              href="/register" underline="none"
              onClick={(e) => { e.preventDefault(); navigate("/register"); }}
              sx={{ color: "#333333", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Create Account
            </Link>
            <Link
              href="/forgot-password" underline="none"
              onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}
              sx={{ color: "#333333", fontSize: "0.85rem", fontWeight: 400, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
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