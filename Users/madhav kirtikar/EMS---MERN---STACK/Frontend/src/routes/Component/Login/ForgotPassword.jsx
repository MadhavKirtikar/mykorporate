 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from "../../Assets/Login_bg_img.jpg";
import axios from "axios";

// Dummy/backend toggle
const USE_DUMMY = true; // true: dummy data, false: backend data

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (USE_DUMMY) {
      // Dummy: Always success, show a fake reset link
      setResetLinkSent(true);
      setMsg("A password reset link has been sent to your email.");
      return;
    }
    try {
      // Backend: Call your forgot password API
      await axios.post("/api/auth/forgot-password", { email });
      setResetLinkSent(true);
      setMsg("A password reset link has been sent to your email.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      style={{
        background: `linear-gradient(rgba(8,0,58,0.7),rgba(8,0,58,0.7)), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-full max-w-sm relative overflow-hidden">
        <div className="flex">
          <div className="w-full backdrop-filter backdrop-blur-sm rounded-3xl p-7 shadow-2xl border border-white border-opacity-50 shrink-0">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>
            {resetLinkSent ? (
              <div>
                <div className="text-green-400 text-center mb-6 font-semibold">{msg}</div>
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mb-2"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Send Reset Link
                </button>
                {msg && <div className="text-green-400 text-xs text-center">{msg}</div>}
                {error && <div className="text-red-400 text-xs text-center">{error}</div>}
                <p className="text-center text-gray-300 text-xs">
                  Remembered your password?{' '}
                  <Link to="/login" className="text-blue-300 hover:underline transition duration-200">
                    Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;