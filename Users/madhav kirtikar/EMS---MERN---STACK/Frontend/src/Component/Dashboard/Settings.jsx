 import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const USE_DUMMY = true;

const DUMMY_PROFILE = { name: "Admin", email: "admin@email.com" };
const DUMMY_NOTIF = { email: true, sms: false, push: true };
const DUMMY_LAST_LOGIN = "2025-06-10 14:30";

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
      return;
    }
    // ...backend fetch code...
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (USE_DUMMY) return;
    // ...backend update code...
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return;
    if (USE_DUMMY) {
      setPasswords({ current: "", new: "", confirm: "" });
      return;
    }
    // ...backend update code...
  };

  const handleNotifChange = async (e) => {
    const { name, checked } = e.target;
    setNotif((prev) => ({ ...prev, [name]: checked }));
    if (USE_DUMMY) return;
    // ...backend update code...
  };

  // Profile Picture Upload (stylish + preview)
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const url = URL.createObjectURL(file);
      setTempPicUrl(url);
    }
  };

  // Add Profile button click: set as main profile and update sidebar
  const handleAddProfilePic = () => {
    if (tempPicUrl) {
      setProfilePicUrl(tempPicUrl);
      localStorage.setItem("adminProfilePic", tempPicUrl);
      setTempPicUrl("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // Delete Account handlers
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    alert("Account deleted!");
    navigate("/");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar profilePicUrl={profilePicUrl} />
      <main
        className={`
          flex-1 p-4 md:p-10 ml-0 md:ml-64
          transform transition-transform duration-500
          ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-purple-700 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-500 via-red-500 to-blue-400 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          {/* Profile Picture Upload */}
          <section className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 text-purple-700">Profile Picture</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <label className="flex flex-col items-center cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-blue-300 flex items-center justify-center mb-2 shadow-lg border-4 border-white">
                  <img
                    src={
                      tempPicUrl ||
                      profilePicUrl ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
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