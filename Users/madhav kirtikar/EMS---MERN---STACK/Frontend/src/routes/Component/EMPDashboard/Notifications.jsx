import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_NOTIFICATIONS = [
  {
    message: "Your leave request has been approved.",
    date: "2025-06-15 10:30 AM",
    read: false,
  },
  {
    message: "Salary credited for June.",
    date: "2025-06-10 09:00 AM",
    read: true,
  },
  {
    message: "New event: Team Meeting at 4 PM.",
    date: "2025-06-09 08:00 AM",
    read: false,
  },
];

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend or dummy
  useEffect(() => {
    setLoading(true);
    if (!user) return;
    const fetchNotifications = async () => {
      if (USE_DUMMY) {
        setNotifications(DUMMY_NOTIFICATIONS);
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch {
        setNotifications([]);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your notifications.
      </div>
    );
  }

  const markAllRead = async () => {
    if (USE_DUMMY) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  // Helper: get icon and color by type
  const getIcon = (msg) => {
    if (msg.toLowerCase().includes("leave")) return <FaCheckCircle className="text-green-500 mr-2" />;
    if (msg.toLowerCase().includes("salary")) return <FaMoneyBillWave className="text-blue-500 mr-2" />;
    if (msg.toLowerCase().includes("event")) return <FaCalendarAlt className="text-purple-500 mr-2" />;
    return <FaInfoCircle className="text-gray-400 mr-2" />;
  };
  // Helper: get border color
  const getBorder = (msg) => {
    if (msg.toLowerCase().includes("leave")) return "border-green-300";
    if (msg.toLowerCase().includes("salary")) return "border-blue-300";
    if (msg.toLowerCase().includes("event")) return "border-purple-300";
    return "border-gray-200";
  };
  // Helper: format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr.replace(/\s\d{2}:\d{2}\s[AP]M/, ""));
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Title same style as Settings/Calendar */}
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Notifications
        </span>
      </h2>
      <div className="flex justify-between items-center mb-6">
        {/* User name same as other pages */}
        <div className="text-lg font-bold text-blue-700 bg-blue-100 px-5 py-2 rounded-full shadow border border-blue-200">
          {user.name}
        </div>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
          onClick={markAllRead}
        >
          Mark all as read
        </button>
      </div>
      {/* Search/filter (optional) */}
      {/* <input type="text" placeholder="Search notifications..." className="mb-4 px-4 py-2 rounded-lg border border-purple-200 w-full" /> */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading notifications...</div>
      ) : (
        <ul className="space-y-4">
          {notifications.length === 0 && (
            <li className="text-center text-gray-400">No notifications found.</li>
          )}
          {notifications.map((n, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-4 p-4 rounded-xl shadow border-l-4 ${getBorder(n.message)} ${n.read ? "bg-gray-100 text-gray-500" : "bg-gradient-to-r from-purple-100 via-blue-50 to-white text-purple-800 font-semibold"}`}
            >
              <div className="flex-shrink-0 w-3 h-3 mt-2 rounded-full" style={{ background: n.read ? "#cbd5e1" : "#a78bfa", boxShadow: n.read ? "none" : "0 0 0 2px #a78bfa" }}></div>
              <div className="flex items-center">
                {getIcon(n.message)}
                <div>
                  <div>{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(n.date)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;