 import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const USE_DUMMY = false; // true: dummy data, false: backend data

const DUMMY_USER = {
  name: "Employee Name",
  profile: "",
};

const EmployeeSidebar = ({ user }) => {
  // Use dummy user if USE_DUMMY is true
  const actualUser = USE_DUMMY ? DUMMY_USER : user;

  // Get name and profile from localStorage if available, else from user prop
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profile") ||
    actualUser?.photo ||
    ""
  );
  const [empName, setEmpName] = useState(
    localStorage.getItem("name") || actualUser?.name || "Employee"
  );

  useEffect(() => {
    // Update profile image and name from localStorage or user prop
    const updateSidebar = () => {
      setProfileImg(
        localStorage.getItem("profile") ||
        actualUser?.photo ||
        ""
      );
      setEmpName(localStorage.getItem("name") || actualUser?.name || "Employee");
    };

    updateSidebar();

    const onStorage = (e) => {
      if (e.key === "profile" || e.key === "name") {
        updateSidebar();
      }
    };
    window.addEventListener("storage", onStorage);

    const interval = setInterval(updateSidebar, 500);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [actualUser?.name]);

  if (!actualUser) return null;

  // Agar profile image nahi hai (user ne add/change nahi kiya), sidebar hi na dikhao
  const profileValue = localStorage.getItem("profile");
  if (
    !profileValue ||
    profileValue === "null" ||
    profileValue === "undefined" ||
    profileValue.trim() === "" ||
    profileValue.startsWith("data:image") === false // Only show if user has uploaded an image
  ) {
    return null;
  }

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
        <div className="mt-6 font-extrabold text-2xl text-teal-700">{empName}</div>
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