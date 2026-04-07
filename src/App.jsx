// ============================================================
// FILE: src/App.jsx
// PURPOSE: Root component with ROUTING between pages
//
// NEW CONCEPT: React Router
// React Router lets us show different pages based on the URL:
//   /login           → shows LoginPage
//   /register        → shows RegisterPage
//   /forgot-password → shows ForgotPasswordPage (coming later)
//   /                → redirects to /login
// ============================================================

import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// ─────────────────────────────────────────────────────────────
// NEW IMPORTS: React Router components
// ─────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// BrowserRouter → Wraps your app to enable routing
// Routes        → Container for all your Route definitions
// Route         → Maps a URL path to a component
// Navigate      → Redirects from one path to another

// ─────────────────────────────────────────────────────────────
// PAGE IMPORTS
// ─────────────────────────────────────────────────────────────

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ─────────────────────────────────────────────────────────────
// THE APP COMPONENT
// ─────────────────────────────────────────────────────────────

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 
        BrowserRouter: Enables client-side routing.
        "Client-side" means the browser doesn't reload the page
        when navigating — React just swaps the component.
      */}
      <BrowserRouter>
        {/* 
          Routes: Looks at the current URL and renders
          the matching Route's component.
        */}
        <Routes>
          {/* 
            Route: Maps a URL path to a component.
            
            path="/login"     → when URL is /login, show LoginPage
            element={<LoginPage />} → the component to render
          */}
          <Route path="/login" element={<LoginPage />} />

          {/* 
            path="/register"  → when URL is /register, show RegisterPage
          */}
          <Route path="/register" element={<RegisterPage />} />

          {/* 
            path="/"          → when URL is just / (root)
            Navigate to="/login" → redirect to /login
            replace           → replaces the history entry
                                (so clicking "Back" in browser
                                 doesn't create an infinite loop)
          */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 
            COMING LATER: Add these routes as you build more pages
            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/home" element={<HomePage />} />
          */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;