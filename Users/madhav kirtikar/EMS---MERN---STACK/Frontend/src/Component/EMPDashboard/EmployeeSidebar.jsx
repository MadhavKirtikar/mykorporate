 import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_USER = {
  name: "Employee Name",
  profile: "",
};

const EmployeeSidebar = ({ user }) => {
  const actualUser = USE_DUMMY ? DUMMY_USER : user;

  const [profileImg, setProfileImg] = useState(localStorage.getItem("profile") || "");
  const [empName, setEmpName] = useState(localStorage.getItem("name") || "Employee");

  useEffect(() => {
    const updateSidebar = () => {
      const storedProfile = localStorage.getItem("profile");
      const storedName = localStorage.getItem("name");

      setProfileImg(storedProfile || actualUser?.photo || "");
      setEmpName(storedName || actualUser?.name || "Employee");
    };

    updateSidebar();

    const interval = setInterval(updateSidebar, 1000);
    window.addEventListener("storage", updateSidebar);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateSidebar);
    };
  }, [actualUser?.name, actualUser?.photo]);

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
    <aside className="hidden md:flex flex-col w-72 min-h-screen shadow-2xl border-r-4 border-cyan-200 bg-white">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-10">
        {profileImg && profileImg.startsWith("data:image") ? (
          <img
            src={profileImg}
            alt="Profile"
            className="w-28 h-28 rounded-full bg-white border-4 border-cyan-200 shadow-lg object-cover"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-4xl font-extrabold shadow-inner border-4 border-cyan-200">
            {empName?.charAt(0)?.toUpperCase() || "E"}
          </div>
        )}

        <div className="mt-4 font-extrabold text-2xl text-cyan-700 tracking-wide">
          {empName}
        </div>
        <div className="text-sm text-orange-500 font-semibold uppercase tracking-widest mt-1">
          Employee
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 px-6 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.exact}
            className={({ isActive }) =>
              `px-6 py-3 rounded-xl font-semibold text-lg flex items-center justify-start tracking-wide transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-400 text-white shadow-lg scale-105"
                  : "text-cyan-800 hover:bg-cyan-100 hover:text-black hover:scale-105 hover:shadow"
              }`
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
