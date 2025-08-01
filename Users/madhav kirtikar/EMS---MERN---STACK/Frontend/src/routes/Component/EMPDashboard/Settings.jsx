 import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
      setMessage("Settings saved!");
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
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("profile");
  localStorage.removeItem("name");
  localStorage.removeItem("empRememberData");
  navigate("/login");
};

  return (
  <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8">
    {/* Profile Picture */}
    <div className="flex flex-col items-center mb-4">
      <div className="relative group">
        {profilePreview && profilePreview.startsWith("data:image") ? (
          <img
            src={profilePreview}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-purple-300 shadow-md object-cover bg-white transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-purple-600 text-white text-4xl font-bold flex items-center justify-center border-4 border-purple-300 shadow-md uppercase transition duration-300 hover:scale-105">
            {user.name?.charAt(0) || "U"}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-1 right-1 bg-purple-600 text-white rounded-full p-1 shadow hover:bg-purple-700 transition"
          title={profilePreview ? "Change Photo" : "Add Photo"}
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
      <span className="text-purple-700 font-semibold text-xs mt-2">
        {profilePreview ? "Change Photo" : "Add Photo"}
      </span>
    </div>

    {/* Heading */}
    <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
      My Account Settings
    </h2>

    {/* Settings Form */}
    <form
      onSubmit={handleSave}
      className="bg-white rounded-2xl shadow-xl w-full max-w-3xl px-8 py-6 border border-purple-100"
    >
      <table className="w-full text-left border-separate border-spacing-y-3">
        <tbody>
          {/* Fields */}
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "DOB", name: "dob", type: "date" },
            { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
            { label: "Address", name: "address", type: "text" },
          ].map((field) => (
            <tr key={field.name}>
              <td className="font-semibold text-purple-800 w-32">{field.label}</td>
              <td>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={user[field.name]}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={user[field.name]}
                    onChange={handleChange}
                    className="w-full border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                )}
              </td>
            </tr>
          ))}

          {/* Notifications */}
          <tr>
            <td className="font-semibold text-purple-800">Notifications</td>
            <td>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={user.notifications}
                  onChange={handleChange}
                  className="accent-purple-600 w-4 h-4"
                />
                <span className="text-purple-600 font-semibold">Enable Notifications</span>
              </label>
            </td>
          </tr>

          {/* Passwords */}
          <tr>
            <td className="font-semibold text-purple-800 align-top">Password</td>
            <td>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full border border-purple-300 rounded px-3 py-2"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full border border-purple-300 rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="bg-purple-200 px-2 py-1 rounded font-semibold text-purple-700 hover:bg-purple-300"
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
        className={`mt-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:from-purple-700 hover:to-blue-600 transition w-full ${
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

    {/* Danger Zone */}
    <div className="mt-9 w-full max-w-2xl bg-red-25">
       
      <button
        type="button"
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-base hover:from-red-700 hover:to-pink-600 transition w-full shadow-md"
      >
        Logout
      </button>
    </div>

    {/* Tip */}
    <div className="text-xs text-purple-800 mt-6 text-center">
      Tip: Update your profile info and photo. Changes will instantly reflect in your dashboard and sidebar.
    </div>
  </div>
);

};

export default Settings;