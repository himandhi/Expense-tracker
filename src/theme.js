// ============================================================
// FILE: src/theme.js
// PURPOSE: Customize Material UI's default look & feel
// ============================================================

// Step 3a: Import createTheme from MUI
// createTheme lets us override MUI's default colors, fonts, etc.
import { createTheme } from "@mui/material/styles";

// Step 3b: Create and export our custom theme
const theme = createTheme({
  // -- palette: controls all colors across MUI components --
  palette: {
    primary: {
      main: "#1a8fb5", // Our main brand color (the blue from your image)
      light: "#4db6d9", // Lighter version (hover states, etc.)
      dark: "#0d6d8a", // Darker version (active states, etc.)
    },
    secondary: {
      main: "#6c757d", // Grey for secondary actions
    },
    background: {
      default: "#d4d4d4", // Page background (light grey like your image)
      paper: "#b0b0b0", // Card/container background (darker grey)
    },
    text: {
      primary: "#2c2c2c", // Dark text for headings
      secondary: "#555555", // Lighter text for labels
    },
  },

  // -- typography: controls fonts and text sizes --
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    h4: {
      fontWeight: 700, // Bold for the "Login" heading
      fontSize: "1.8rem",
    },
  },

  // -- shape: controls border-radius globally --
  shape: {
    borderRadius: 4, // Slightly rounded corners
  },
});

// Export so other files can import it
export default theme;