 import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const USE_DUMMY = false; // true: dummy data, false: backend data

const DUMMY_USER = {
  name: "Employee Name",
  email: "emp@demo.com",
  phone: "9876543210",
  department: "Development",
  notifications: true,
  password: "",
  confirmPassword: "",
  profile: "",
  dob: "1998-01-01",
  gender: "Male",
  address: "Mumbai, India",
};

const Settings = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "", 
    notifications: true,
    password: "",
    confirmPassword: "",
    profile: localStorage.getItem("profile") || "",
    dob: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(user.profile);
  const fileInputRef = useRef();

  // Load user from backend/localStorage on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (USE_DUMMY) {
        setUser({ ...DUMMY_USER, password: "", confirmPassword: "" });
        setProfilePreview(DUMMY_USER.profile || "");
        if (DUMMY_USER.profile) localStorage.setItem("profile", DUMMY_USER.profile);
        localStorage.setItem("name", DUMMY_USER.name); // sync name for sidebar
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/employee/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...res.data, password: "", confirmPassword: "" });
        setProfilePreview(res.data.profile || "");
        if (res.data.profile) localStorage.setItem("profile", res.data.profile);
        if (res.data.name) localStorage.setItem("name", res.data.name);
      } catch {
        setMessage("Failed to load user data.");
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Sync name to localStorage for sidebar
    if (name === "name") {
      localStorage.setItem("name", value);
    }
  };

  // Handle profile image change
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePreview(ev.target.result);
      setUser((prev) => ({
        ...prev,
        profile: ev.target.result,
      }));
      localStorage.setItem("profile", ev.target.result); // Sidebar sync
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (user.password && user.password !== user.confirmPassword) {
      setLoading(false);
      setMessage("Passwords do not match!");
      return;
    }
    // Sync name and profile to localStorage for sidebar
    if (user.profile) {
      localStorage.setItem("profile", user.profile);
    }
    if (user.name) {
      localStorage.setItem("name", user.name);
    }
    if (USE_DUMMY) {
      setMessage("Settings saved! (Dummy)");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/employee/settings", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Settings saved!");
      if (user.profile) localStorage.setItem("profile", user.profile);
      if (user.name) localStorage.setItem("name", user.name);
    } catch {
      setMessage("Failed to save settings.");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // Toggle password visibility
  const toggleShowPassword = () => setShowPassword((s) => !s);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Profile Picture on Top Center */}
      <div className="flex flex-col items-center mb-2">
        <div className="relative group">
          <img
            src={
              profilePreview ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.name || "User") +
                "&background=8b5cf6&color=fff"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-purple-300 shadow object-cover bg-white"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 bg-purple-600 text-white rounded-full p-1 shadow hover:bg-purple-700 transition opacity-90 group-hover:opacity-100"
            title={profilePreview ? "Change Profile" : "Add Profile"}
            tabIndex={-1}
            style={{ fontSize: 12 }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 16.5A4.5 4.5 0 1 0 12 7.5a4.5 4.5 0 0 0 0 9Zm7.5-4.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfileChange}
            className="hidden"
          />
        </div>
        <span className="text-purple-700 font-semibold text-xs mt-1">
          {profilePreview ? "Change Photo" : "Add Photo"}
        </span>
      </div>
      <h2 className="text-2xl font-extrabold text-center tracking-wide mb-3 text-purple-700">
        My Settings
      </h2>
      <form
        onSubmit={handleSave}
        className="rounded-xl shadow-lg p-6 w-full max-w-2xl border border-purple-100 bg-white/90 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.97)" }}
      >
        <table className="w-full text-left border-separate border-spacing-y-2">
          <tbody>
            {/* Name */}
            <tr>
              <td className="font-bold text-purple-700 w-32">Name</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                />
              </td>
            </tr>
            {/* Email */}
            <tr>
              <td className="font-bold text-purple-700">Email</td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                />
              </td>
            </tr>
            {/* Phone */}
            <tr>
              <td className="font-bold text-purple-700">Phone</td>
              <td>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                />
              </td>
            </tr>
            
            {/* Date of Birth */}
            <tr>
              <td className="font-bold text-purple-700">DOB</td>
              <td>
                <input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                />
              </td>
            </tr>
            {/* Gender */}
            <tr>
              <td className="font-bold text-purple-700">Gender</td>
              <td>
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </tr>
            {/* Address */}
            <tr>
              <td className="font-bold text-purple-700">Address</td>
              <td>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                />
              </td>
            </tr>
            {/* Notifications */}
            <tr>
              <td className="font-bold text-purple-700">Notifications</td>
              <td>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={user.notifications}
                  onChange={handleChange}
                  id="notifications"
                  className="accent-purple-600 w-4 h-4"
                />
                <label htmlFor="notifications" className="ml-2 text-purple-700 font-bold text-sm">
                  Enable Notifications
                </label>
              </td>
            </tr>
            {/* Change Password */}
            <tr>
              <td className="font-bold text-purple-700 align-top">Password</td>
              <td>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="New Password"
                    className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                    autoComplete="new-password"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 text-base"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="px-2 py-1 rounded bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition text-xs"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg font-bold text-base hover:from-purple-700 hover:to-blue-600 transition w-full shadow ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {/* Message */}
        {message && (
          <div
            className={`text-center mt-3 font-semibold ${
              message.includes("not match") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
      <div className="text-xs text-blue-800 mt-2 text-center">
        Tip: Update your profile photo, info, and password here.<br />
        All changes reflect instantly in your sidebar and profile.
      </div>
    </div>
  );
};

export default Settings;