 import React, { useState, useRef, useEffect } from "react";
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
  profile: localStorage.getItem("profile") || "",
};

const Settings = () => {
  const [user, setUser] = useState(DUMMY_USER);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(user.profile);
  const fileInputRef = useRef();

  // Load user from backend/localStorage on mount (for backend support)
  useEffect(() => {
    if (!USE_DUMMY) {
      // Uncomment and use when backend is ready
      /*
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("/api/employee/settings", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({ ...res.data, password: "", confirmPassword: "" });
          setProfilePreview(res.data.profile || "");
          if (res.data.profile) localStorage.setItem("profile", res.data.profile);
        } catch {
          setMessage("Failed to load user data.");
        }
      };
      fetchUser();
      */
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (user.profile) {
      localStorage.setItem("profile", user.profile); // Sidebar sync
    }
    if (USE_DUMMY) {
      setTimeout(() => {
        setLoading(false);
        setMessage("Settings saved!");
      }, 800);
      return;
    }
    try {
      // Uncomment and update endpoint when backend is ready
      /*
      const token = localStorage.getItem("token");
      await axios.put("/api/employee/settings", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      */
      setMessage("Settings saved!");
      if (user.profile) localStorage.setItem("profile", user.profile);
    } catch {
      setMessage("Failed to save settings.");
    }
    setLoading(false);
  };

  // Toggle password visibility
  const toggleShowPassword = () => setShowPassword((s) => !s);

  return (
    <div>
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          My Settings
        </span>
      </h2>
      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-3xl shadow-2xl p-12 border border-purple-100"
        style={{ background: "none" }} // BG hata diya
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={
                profilePreview ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.name || "User") +
                  "&background=8b5cf6&color=fff"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-purple-200 shadow-lg object-cover bg-white"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-700 transition opacity-90 group-hover:opacity-100"
              title={profilePreview ? "Change Profile" : "Add Profile"}
              tabIndex={-1}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
          <span className="text-purple-700 font-semibold text-base">
            {profilePreview ? "Change Profile Photo" : "Add Profile Photo"}
          </span>
        </div>
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
      <div className="text-xs text-gray-400 mt-8 text-center"></div>
    </div>
  );
};

export default Settings;