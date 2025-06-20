 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink, useLocation } from 'react-router-dom';

// Helper to get initials from name
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// --- AdminSidebar Component (inline for this file) ---
const AdminSidebar = ({ profilePicUrl, adminNameProp }) => {
    const location = useLocation();
    const adminName = adminNameProp || localStorage.getItem("adminName") || "Admin User";
    const [sidebarName, setSidebarName] = useState(adminName);

    useEffect(() => {
        const updateName = () => setSidebarName(localStorage.getItem("adminName") || "Admin User");
        window.addEventListener("storage", updateName);
        const interval = setInterval(updateName, 500);
        return () => {
            window.removeEventListener("storage", updateName);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        setSidebarName(localStorage.getItem("adminName") || "Admin User");
    }, [location.pathname]);

    // Show initials if no profilePicUrl
    const showInitials = !profilePicUrl;

    return (
        <aside
            className="bg-white/60 backdrop-blur-md text-black h-screen fixed left-0 top-0 bottom-0 w-72 px-6 py-4 space-y-6 shadow-2xl border-r border-white/30 overflow-y-auto z-50"
            style={{
                boxShadow: "0 0 32px 0 rgba(80, 60, 180, 0.13), 0 2px 8px 0 rgba(80, 60, 180, 0.09)"
            }}
        >
            <div className="flex flex-col items-center border-b border-black/20 pb-4">
                <div className="relative mb-2">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-400 p-1 shadow-xl flex items-center justify-center">
                        {showInitials ? (
                          <span className="w-28 h-28 rounded-full flex items-center justify-center bg-white text-4xl font-bold text-purple-600 border-4 border-white shadow-lg select-none">
                            {getInitials(sidebarName)}
                          </span>
                        ) : (
                          <img
                            src={profilePicUrl}
                            alt="Admin"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        )}
                        <span className="absolute bottom-3 right-3 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-800 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide mt-2">
                    {sidebarName}
                </div>
                <div className="uppercase text-xs tracking-widest text-purple-700 font-semibold mt-1">
                    Admin Dashboard
                </div>
            </div>
            <nav className="flex flex-col space-y-3 mt-4">
                <NavLink to="/admin/dashboard" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>🏠</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Dashboard</span>
                </NavLink>
                <NavLink to="/admin/employees" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>👥</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Employees</span>
                </NavLink>
                <NavLink to="/admin/departments" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>🏢</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Department</span>
                </NavLink>
                <NavLink to="/admin/leave" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>📝</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Leave</span>
                </NavLink>
                <NavLink to="/admin/salary" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>💸</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Salary</span>
                </NavLink>
                <NavLink to="/admin/reports" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>📊</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Reports</span>
                </NavLink>
                <NavLink to="/admin/events" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>📅</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Events</span>
                </NavLink>
                <NavLink to="/admin/settings" className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                        isActive
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`
                }>
                    <span>⚙️</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Settings</span>
                </NavLink>
            </nav>
        </aside>
    )
};
// --- End AdminSidebar ---

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_PROFILE = {
  name: "Admin User",
  email: "admin@demo.com",
};
const DUMMY_NOTIF = {
  email: true,
  sms: false,
  push: true,
};
const DUMMY_LAST_LOGIN = "2025-06-16 10:30 AM";
const DUMMY_PROFILE_PIC = ""; // No default image, so initials will show

const Settings = () => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [notif, setNotif] = useState({
    email: false,
    sms: false,
    push: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Profile Picture
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(() => {
    return localStorage.getItem("adminProfilePic") || "";
  });
  const [tempPicUrl, setTempPicUrl] = useState(""); // For preview before add

  // Last Login Info
  const [lastLoginTime, setLastLoginTime] = useState("");

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
    if (USE_DUMMY) {
      setProfile(DUMMY_PROFILE);
      setNotif(DUMMY_NOTIF);
      setLastLoginTime(DUMMY_LAST_LOGIN);
      setProfilePicUrl(DUMMY_PROFILE_PIC);
      return;
    }
    axios.get("/api/admin/profile").then(res => {
      setProfile(res.data?.profile || DUMMY_PROFILE);
      setNotif(res.data?.notif || DUMMY_NOTIF);
      setLastLoginTime(res.data?.lastLogin || DUMMY_LAST_LOGIN);
      setProfilePicUrl(res.data?.profilePicUrl || DUMMY_PROFILE_PIC);
    }).catch(() => {
      setProfile(DUMMY_PROFILE);
      setNotif(DUMMY_NOTIF);
      setLastLoginTime(DUMMY_LAST_LOGIN);
      setProfilePicUrl(DUMMY_PROFILE_PIC);
    });
  }, []);

  const handleProfileChange =(e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (USE_DUMMY) {
      setProfile(profile);
      localStorage.setItem("adminName", profile.name);
       
      return;
    }
    try {
      const res = await axios.put("/api/admin/profile", profile);
      setProfile(res.data.profile);
      localStorage.setItem("adminName", res.data.profile.name);
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    if (USE_DUMMY) {
      setPasswords({ current: "", new: "", confirm: "" });
      alert("Password changed! (Dummy)");
      return;
    }
    try {
      await axios.put("/api/admin/password", {
        current: passwords.current,
        new: passwords.new,
      });
      setPasswords({ current: "", new: "", confirm: "" });
      alert("Password changed!");
    } catch (err) {
      alert("Failed to change password");
    }
  };

  const handleNotifChange = async (e) => {
    const { name, checked } = e.target;
    setNotif((prev) => ({ ...prev, [name]: checked }));
    if (USE_DUMMY) return;
    try {
      await axios.put("/api/admin/notifications", { ...notif, [name]: checked });
    } catch {
      // Optionally handle error
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const url = URL.createObjectURL(file);
      setTempPicUrl(url);
    }
  };

  const handleAddProfilePic = async () => {
    if (tempPicUrl && profilePic) {
      if (USE_DUMMY) {
        setProfilePicUrl(tempPicUrl);
        localStorage.setItem("adminProfilePic", tempPicUrl);
        setTempPicUrl("");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("profilePic", profilePic);
        const res = await axios.post("/api/admin/profile-pic", formData);
        setProfilePicUrl(res.data.url);
        localStorage.setItem("adminProfilePic", res.data.url);
        setTempPicUrl("");
      } catch {
        alert("Failed to upload profile picture");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (USE_DUMMY) {
      alert("Account deleted! (Dummy)");
      navigate("/");
      return;
    }
    try {
      await axios.delete("/api/admin/account");
      alert("Account deleted!");
      navigate("/");
    } catch {
      alert("Failed to delete account");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar profilePicUrl={profilePicUrl} adminNameProp={profile.name} />
      <main
        className={`
          flex-1 p-4 md:p-10 ml-0 md:ml-72
          transform transition-transform duration-500
          ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-purple-700 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          {/* Profile Picture Upload */}
          <section className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-purple-700">Profile Picture</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <label className="flex flex-col items-center cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-blue-300 flex items-center justify-center mb-2 shadow-lg border-4 border-white">
                  {tempPicUrl ? (
                    <img
                      src={tempPicUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : profilePicUrl ? (
                    <img
                      src={profilePicUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-3xl font-bold text-purple-600 select-none">
                      {getInitials(profile.name)}
                    </span>
                  )}
                </div>
                <span className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-500 transition text-sm">
                  Choose Profile Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                className={`ml-0 md:ml-4 mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-blue-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-500 transition text-sm ${
                  tempPicUrl ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddProfilePic}
                disabled={!tempPicUrl}
              >
                Add Profile
              </button>
            </div>
          </section>
          {/* Last Login Info */}
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-5 py-2 rounded-xl shadow text-blue-700 font-semibold text-base border border-blue-200">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Last login: <span className="ml-1">{lastLoginTime}</span>
            </div>
          </div>
          {/* Profile Update */}
          <section className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-purple-700">Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
                  placeholder="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                />
                <input
                  className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
                  placeholder="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-500 transition">
                Update Profile
              </button>
            </form>
          </section>
          {/* Password Update */}
          <section className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-purple-700">Change Password</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
                  placeholder="Current Password"
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  required
                />
                <input
                  className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
                  placeholder="New Password"
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  required
                />
                <input
                  className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">
                Change Password
              </button>
            </form>
          </section>
          {/* Notifications */}
          <section className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-purple-700">Notifications</h2>
            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  name="email"
                  checked={notif.email}
                  onChange={handleNotifChange}
                />
                <span className="text-gray-600">Email notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  name="sms"
                  checked={notif.sms}
                  onChange={handleNotifChange}
                />
                <span className="text-gray-600">SMS notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  name="push"
                  checked={notif.push}
                  onChange={handleNotifChange}
                />
                <span className="text-gray-600">Push notifications</span>
              </label>
            </div>
          </section>
          {/* Danger Zone */}
          <section className="bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h2>
            <button
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition w-full mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>
        </div>
        {/* Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-red-600">
                Are you sure?
              </h3>
              <p className="mb-6">
                Do you really want to delete your admin account? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;