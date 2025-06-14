 import React, { useState, useEffect } from "react";

// Dummy notifications for frontend testing
const USE_DUMMY = true; // Jab backend aayega, sirf isko false kar dena

const DUMMY_NOTIFICATIONS = [
  { message: "Your leave for 15 June is approved.", date: "2025-06-10", read: false },
  { message: "Payslip for May 2025 is now available.", date: "2025-06-05", read: false },
  { message: "Team meeting scheduled on 20 June.", date: "2025-06-01", read: true },
];

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications (dummy or backend)
  useEffect(() => {
    setLoading(true);
    if (USE_DUMMY) {
      setTimeout(() => {
        setNotifications(DUMMY_NOTIFICATIONS);
        setLoading(false);
      }, 400);
      return;
    }
    // Uncomment below for backend
    /*
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setNotifications([]);
        setLoading(false);
      });
    */
  }, []);

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
    // Uncomment below for backend
    /*
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
    */
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
              className={`flex items-start gap-4 p-4 rounded-xl shadow ${
                n.read
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gradient-to-r from-purple-100 via-blue-50 to-white text-purple-800 font-semibold"
              }`}
            >
              <div
                className="flex-shrink-0 w-3 h-3 mt-2 rounded-full"
                style={{
                  background: n.read ? "#cbd5e1" : "#a78bfa",
                  boxShadow: n.read ? "none" : "0 0 0 2px #a78bfa"
                }}
              ></div>
              <div>
                <div>{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{n.date}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;