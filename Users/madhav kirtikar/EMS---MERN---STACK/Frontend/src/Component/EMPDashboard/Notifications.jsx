 import React, { useState, useEffect } from "react";

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your notifications.
      </div>
    );
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Notifications</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
          onClick={markAllRead}
        >
          Mark all as read
        </button>
      </div>
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
    </div>
  );
};

export default Notifications;