 import React, { useState } from "react";
// import axios from "axios"; // Uncomment when backend is ready

const USE_DUMMY = true; // Jab backend aayega, sirf isko false kar dena

const DUMMY_USER = {
  name: "Amit Kumar",
  email: "amit@demo.com",
  phone: "9876543210",
  department: "HR",
  notifications: true,
  password: "",
  confirmPassword: "",
};

const Settings = () => {
  const [user, setUser] = useState(DUMMY_USER);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle save (dummy/backend switch)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (user.password && user.password !== user.confirmPassword) {
      setLoading(false);
      setMessage("Passwords do not match!");
      return;
    }
    if (USE_DUMMY) {
      setTimeout(() => {
        setLoading(false);
        setMessage("Settings saved (frontend only)");
      }, 800);
      return;
    }
    try {
      // Uncomment and update endpoint when backend is ready
      // await axios.put("/api/employee/settings", user, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Settings saved!");
    } catch {
      setMessage("Failed to save settings.");
    }
    setLoading(false);
  };

  // Toggle password visibility
  const toggleShowPassword = () => setShowPassword((s) => !s);

  return (
    <div className="">
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          My Settings
        </span>
      </h2>
      <form
        onSubmit={handleSave}
        className="space-y-8 bg-white/90 rounded-3xl shadow-2xl p-12 border border-purple-100"
      >
        {/* Name */}
        <div>
          <label className="block text-base font-bold text-purple-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-base font-bold text-purple-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-base font-bold text-purple-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
          />
        </div>
        {/* Department */}
        <div>
          <label className="block text-base font-bold text-purple-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
          />
        </div>
         
        
        {/* Notifications */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="notifications"
            checked={user.notifications}
            onChange={handleChange}
            id="notifications"
            className="accent-purple-600 w-5 h-5"
          />
          <label htmlFor="notifications" className="text-purple-700 font-bold text-base">
            Enable Notifications
          </label>
        </div>
       
        {/* Change Password */}
        <div>
          <label className="block text-base font-bold text-purple-700 mb-1">Change Password</label>
          <div className="flex gap-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
              autoComplete="new-password"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-600 transition w-full shadow ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {/* Message */}
        {message && (
          <div
            className={`text-center mt-2 font-semibold ${
              message.includes("not match") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
      <div className="text-xs text-gray-400 mt-8 text-center">
          </div>
    </div>
  );
};

export default Settings;