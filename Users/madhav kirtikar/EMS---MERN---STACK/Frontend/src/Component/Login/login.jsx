 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Backend ke liye, abhi comment kar diya
import logicBg from "../../Assets/logic.jpg";

// Dummy/backend toggle
const USE_DUMMY = true; // true: dummy data, false: backend data

// =====================
// Dummy API Functions (backend ki jagah)
const employeeLogin = async ({ email, password }) => {
  if (USE_DUMMY) {
    // Dummy login: email "emp@demo.com" & password "123456"
    if (email === "emp@demo.com" && password === "123456") {
      return { data: { token: "dummy-emp-token" } };
    }
    throw new Error("Invalid employee credentials");
  } else {
    // Backend API call
     const res = await axios.post("/api/employee/login", { email, password });
     return res;
    throw new Error("Backend not implemented");
  }
};

const adminLogin = async ({ username, password }) => {
  if (USE_DUMMY) {
    // Dummy login: username "admin" & password "admin123"
    if (username === "admin" && password === "admin123") {
      return { data: { token: "dummy-admin-token" } };
    }
    throw new Error("Invalid admin credentials");
  } else {
    // Backend API call
     const res = await axios.post("/api/admin/login", { username, password });
     return res;
    throw new Error("Backend not implemented");
  }
};

const adminRegister = async ({ username, email, password }) => {
  if (USE_DUMMY) {
    // Dummy register: always success
    return { data: { token: "dummy-admin-token" } };
  } else {
    // Backend API call
     const res = await axios.post("/api/admin/register", { username, email, password });
     return res;
    throw new Error("Backend not implemented");
  }
};
// =====================

// Utility: Check if admin exists (dummy)
const checkAdminExists = async () => {
  if (USE_DUMMY) {
    // Dummy: admin always exists after first register
    const exists = localStorage.getItem("dummyAdminExists");
    return !!exists;
  } else {
    // Backend API call
     const res = await axios.get("/api/admin/exists");
     return res.data.exists;
    return false;
  }
};

const LoginRegister = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [empShowPassword, setEmpShowPassword] = useState(false);
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [empRemember, setEmpRemember] = useState(false);
  const [adminRemember, setAdminRemember] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  // Check admin existence on mount and after register/delete
  useEffect(() => {
    (async () => {
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
      } catch {
        setAdminExists(false);
      }
    })();
  }, [showAdminRegister, showAdminLogin]);

  // Remember Me: Load from localStorage on mount
  useEffect(() => {
    const empData = JSON.parse(localStorage.getItem('empRememberData'));
    if (empData) {
      setEmpEmail(empData.email);
      setEmpPassword(empData.password);
      setEmpRemember(true);
    }
    const adminData = JSON.parse(localStorage.getItem('adminRememberData'));
    if (adminData) {
      setAdminUsername(adminData.username);
      setAdminPassword(adminData.password);
      setAdminRemember(true);
    }
  }, []);

  const SocialButtons = () => (
    <div className="flex flex-row gap-4 mt-4 justify-center"></div>
  );

  const handleEmpLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await employeeLogin({ email: empEmail, password: empPassword });
      localStorage.setItem('token', res.data.token);
      if (empRemember) {
        localStorage.setItem('empRememberData', JSON.stringify({ email: empEmail, password: empPassword }));
      } else {
        localStorage.removeItem('empRememberData');
      }
      navigate('/emp');
    } catch (err) {
      setError('Invalid employee credentials');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminLogin({ username: adminUsername, password: adminPassword });
      localStorage.setItem('token', res.data.token);
      if (adminRemember) {
        localStorage.setItem('adminRememberData', JSON.stringify({ username: adminUsername, password: adminPassword }));
      } else {
        localStorage.removeItem('adminRememberData');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid admin credentials');
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError('All fields are required.');
      return;
    }
    if (!validateEmail(registerEmail)) {
      setRegisterError('Invalid email format.');
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    try {
      const res = await adminRegister({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      });
      localStorage.setItem('token', res.data.token);
      setShowAdminRegister(false);
      setShowAdminLogin(true);
      setAdminUsername(registerUsername);
      setAdminPassword(registerPassword);
      setAdminExists(true);
      if (USE_DUMMY) {
        localStorage.setItem("dummyAdminExists", "true"); // Dummy admin exists flag
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setRegisterError('Registration failed. Username or email may already exist.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2"
      style={{
        background: `linear-gradient(rgba(8,0,58,0.7),rgba(8,0,58,0.7)), url(${logicBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-full max-w-sm relative overflow-hidden">
        {/* Employee Login */}
        {!showAdminLogin && !showAdminRegister && (
          <form
            onSubmit={handleEmpLogin}
            className="w-full backdrop-filter backdrop-blur-sm rounded-3xl p-7 shadow-2xl border border-white border-opacity-50 shrink-0"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Employee Email"
                  value={empEmail}
                  onChange={e => setEmpEmail(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type={empShowPassword ? "text" : "password"}
                  placeholder="Password"
                  value={empPassword}
                  onChange={e => setEmpPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
                  onClick={() => setEmpShowPassword(!empShowPassword)}
                >
                  {empShowPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12c0-2.21.896-4.21 2.343-5.657" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-400 checked:bg-blue-500 checked:border-transparent transition duration-200"
                    checked={empRemember}
                    onChange={e => setEmpRemember(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-300">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-500 hover:underline transition duration-200">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center space-x-2 text-sm"
              >
                <span>Login</span>
              </button>
              {error && <div className="text-red-400 text-xs text-center">{error}</div>}
              <p className="text-center text-gray-300 text-xs">
                Admin Login?{' '}
                <button
                  type="button"
                  className="text-blue-300 hover:underline transition duration-200"
                  onClick={() => { setShowAdminLogin(true); setError(''); }}
                >
                  Admin Login
                </button>
              </p>
              {!adminExists && (
                <p className="text-center text-gray-300 text-xs">
                  New Admin?{' '}
                  <button
                    type="button"
                    className="text-blue-300 hover:underline transition duration-200"
                    onClick={() => { setShowAdminRegister(true); setRegisterError(''); }}
                  >
                    Register
                  </button>
                </p>
              )}
              <SocialButtons />
            </div>
          </form>
        )}

        {/* Admin Login */}
        {showAdminLogin && !showAdminRegister && (
          <form
            onSubmit={handleAdminLogin}
            className="w-full backdrop-filter backdrop-blur-sm rounded-3xl p-7 shadow-2xl border border-white border-opacity-50 shrink-0"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Admin Username"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type={adminShowPassword ? "text" : "password"}
                  placeholder="Password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
                  onClick={() => setAdminShowPassword(!adminShowPassword)}
                >
                  {adminShowPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12c0-2.21.896-4.21 2.343-5.657" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-center text-xs">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-400 checked:bg-blue-500 checked:border-transparent transition duration-200"
                    checked={adminRemember}
                    onChange={e => setAdminRemember(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-300">Remember me</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center space-x-2 text-sm"
              >
                <span>Login</span>
              </button>
              {error && <div className="text-red-400 text-xs text-center">{error}</div>}
              {!adminExists && (
                <p className="text-center text-gray-300 text-xs">
                  New Admin?{' '}
                  <button
                    type="button"
                    className="text-blue-300 hover:underline transition duration-200"
                    onClick={() => { setShowAdminRegister(true); setRegisterError(''); }}
                  >
                    Register
                  </button>
                </p>
              )}
              <p className="text-center text-gray-300 text-xs">
                Employee Login?{' '}
                <button
                  type="button"
                  className="text-blue-300 hover:underline transition duration-200"
                  onClick={() => { setShowAdminLogin(false); setError(''); }}
                >
                  Employee Login
                </button>
              </p>
              <SocialButtons />
            </div>
          </form>
        )}

        {/* Admin Register */}
        {showAdminRegister && (
          <form
            onSubmit={handleAdminRegister}
            className="w-full backdrop-filter backdrop-blur-sm rounded-3xl p-7 shadow-2xl border border-white border-opacity-50 shrink-0"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Register</h2>
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="New Admin Username"
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type={registerShowPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
                  onClick={() => setRegisterShowPassword(!registerShowPassword)}
                >
                  {registerShowPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12c0-2.21.896-4.21 2.343-5.657" />
                    </svg>
                  )}
                </span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type={registerShowConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 text-white bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-300 transition duration-200 text-sm"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
                  onClick={() => setRegisterShowConfirmPassword(!registerShowConfirmPassword)}
                >
                  {registerShowConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10S1 17.523 1 12c0-2.21.896-4.21 2.343-5.657" />
                    </svg>
                  )}
                </span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 flex items-center justify-center space-x-2 text-sm"
              >
                <span>Register</span>
              </button>
              {registerError && <div className="text-red-400 text-xs text-center">{registerError}</div>}
              <p className="text-center text-gray-300 text-xs">
                Already an admin?{' '}
                <button
                  type="button"
                  className="text-blue-300 hover:underline transition duration-200"
                  onClick={() => { setShowAdminRegister(false); setRegisterError(''); setShowAdminLogin(true); }}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;