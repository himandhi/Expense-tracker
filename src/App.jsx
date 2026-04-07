// ============================================================
// FILE: src/App.jsx
// PURPOSE: The root component — entry point for all pages
// ============================================================

import React from "react";

// Step 5a: Import ThemeProvider from MUI
// ThemeProvider wraps your app so ALL MUI components
// automatically use your custom theme (colors, fonts, etc.)
import { ThemeProvider } from "@mui/material/styles";

// Step 5b: Import CssBaseline from MUI
// CssBaseline resets browser default styles (margins, paddings)
// so your app looks the same across Chrome, Firefox, Safari, etc.
import CssBaseline from "@mui/material/CssBaseline";

// Step 5c: Import our custom theme
import theme from "./theme";

// Step 5d: Import the LoginPage component
import LoginPage from "./pages/LoginPage";
// ─────────────────────────────────────────────────────────────
// STEP 5e: THE APP COMPONENT
// Later, you'll add React Router here to switch between
// LoginPage, RegisterPage, HomePage, etc.
// For now, we just show LoginPage.
// ─────────────────────────────────────────────────────────────

function App() {
  return (
    // ThemeProvider passes our theme to ALL child MUI components
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalizes styles across browsers */}
      <CssBaseline />

      {/* 
        For now, we render LoginPage directly.
        
        LATER (when you add more pages), you'll replace 
        <LoginPage /> with React Router like this:
        
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      */}
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;