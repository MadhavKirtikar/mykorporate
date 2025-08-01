 import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ✅ Styling
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // ✅ MUST ADD THIS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>         {/* ✅ Router provides context for useNavigate */}
      <AuthProvider>        {/* ✅ Now useNavigate will work here */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
