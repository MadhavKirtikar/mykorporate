 import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // ✅ यह जोड़ो

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>           {/* ✅ Router को सबसे बाहर wrap करो */}
      <AuthProvider>          {/* ✅ अब useNavigate काम करेगा */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
