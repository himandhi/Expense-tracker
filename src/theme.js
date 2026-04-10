import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  
  palette: {
    primary: {
      main: "#1a8fb5", 
      light: "#4db6d9", 
      dark: "#0d6d8a", 
    },
    secondary: {
      main: "#6c757d", 
    },
    background: {
      default: "#d4d4d4", 
      paper: "#b0b0b0", 
    },
    text: {
      primary: "#2c2c2c", 
      secondary: "#555555", 
    },
  },


  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    h4: {
      fontWeight: 700, 
      fontSize: "1.8rem",
    },
  },


  shape: {
    borderRadius: 4, 
  },
});


export default theme;