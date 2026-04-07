// ============================================================
// FILE: src/main.jsx  (Vite's entry point)
// PURPOSE: The VERY FIRST file that runs when your app starts.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
// ↑ ReactDOM is the bridge between React and the browser's DOM.
//   "DOM" = Document Object Model = the HTML structure of your page.

import App from "./App.jsx";

// Step 6a: Find the HTML element with id="root" in public/index.html
// This is where our entire React app gets "mounted" (inserted).
const root = ReactDOM.createRoot(document.getElementById("root"));

// Step 6b: Render our App inside that root element
// StrictMode adds extra development warnings (only in dev, not production)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);