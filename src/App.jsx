// ============================================================
// FILE: src/App.jsx
// PURPOSE: Root component with routing for all pages
// UPDATED: Added /home route for HomePage
// ============================================================

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Page Imports ──
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          {/* Authentication pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main app page */}
          <Route path="/home" element={<HomePage />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 
            COMING LATER:
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;