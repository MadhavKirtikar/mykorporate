 import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const EmployeeSidebar = ({ user }) => {
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profile") ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Employee")}&background=8b5cf6&color=fff`
  );

  // Listen for profile changes in localStorage (Settings page updates)
  useEffect(() => {
    // Update profile image on mount and when user.name changes
    setProfileImg(
      localStorage.getItem("profile") ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Employee")}&background=8b5cf6&color=fff`
    );

    // Listen for profile changes in localStorage (even from other tabs)
    const onStorage = (e) => {
      if (e.key === "profile") {
        setProfileImg(
          e.newValue ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Employee")}&background=8b5cf6&color=fff`
        );
      }
    };
    window.addEventListener("storage", onStorage);

    // Listen for profile changes in the same tab (Settings page)
    const interval = setInterval(() => {
      const current = localStorage.getItem("profile");
      setProfileImg(prev =>
        prev !== current && current
          ? current
          : prev === "" && current
          ? current
          : prev
      );
    }, 500);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [user?.name]);

  if (!user) return null;

  const links = [
    { name: "Dashboard", path: "/emp", exact: true },
    { name: "My Profile", path: "/emp/profile" },
    { name: "Attendance", path: "/emp/attendance" },
    { name: "Salary & Payslips", path: "/emp/salary" },
    { name: "Leaves", path: "/emp/leave" },
    { name: "Notifications", path: "/emp/notifications" },
    { name: "Calendar & Events", path: "/emp/calendar" },
    { name: "Settings", path: "/emp/settings" }, 
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 min-h-screen shadow-2xl border-r-4 border-cyan-200">
      <div className="flex flex-col items-center py-12 mb-10">
        <img
          src={profileImg}
          alt="Profile"
          className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-300 via-blue-200 to-white border-4 border-white shadow-lg object-cover"
        />
        <div className="mt-6 font-extrabold text-2xl text-teal-700">{user?.name || "Employee"}</div>
        <div className="text-sm text-orange-400 font-semibold tracking-widest uppercase">Employee</div>
      </div>
      <nav className="flex flex-col gap-4 px-6">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.exact}
            className={({ isActive }) =>
              `flex items-center gap-4 px-7 py-4 rounded-2xl text-lg font-bold transition-all duration-200
              ${isActive
                ? "bg-gradient-to-r from-cyan-500 to-orange-300 text-white shadow-xl scale-105"
                : "text-teal-700 hover:bg-cyan-100 hover:scale-105 hover:shadow-md"}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;