 import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_ADMIN = {
    name: "Admin User",
    profilePic: "https://ui-avatars.com/api/?name=Admin+User&background=8b5cf6&color=fff"
};

const AdminSidebar = ({ profilePicUrl }) => {
    const location = useLocation();

    const [profilePic, setProfilePic] = useState(
        profilePicUrl ||
        localStorage.getItem("adminProfilePic") ||
        DUMMY_ADMIN.profilePic
    );
    const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || DUMMY_ADMIN.name);

    // Update name if changed in localStorage (on profile update)
    useEffect(() => {
        const onStorage = () => setAdminName(localStorage.getItem("adminName") || DUMMY_ADMIN.name);
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Also update on route change (for instant update in same tab)
    useEffect(() => {
        setAdminName(localStorage.getItem("adminName") || DUMMY_ADMIN.name);
    }, [location.pathname]);

    // Dummy + Backend: Always show dummy first, then try backend if enabled
    useEffect(() => {
        setAdminName(DUMMY_ADMIN.name);
        setProfilePic(DUMMY_ADMIN.profilePic);

        if (!USE_DUMMY) {
            const token = localStorage.getItem("token");
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            axios.get("/api/admin/profile", config)
                .then(res => {
                    setAdminName(res.data.name || DUMMY_ADMIN.name);
                    setProfilePic(res.data.profilePicUrl || DUMMY_ADMIN.profilePic);
                })
                .catch(() => {
                    setAdminName(DUMMY_ADMIN.name);
                    setProfilePic(DUMMY_ADMIN.profilePic);
                });
        }
        // eslint-disable-next-line
    }, []);

    const admin = {
        name: adminName,
        profilePic
    };

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
                        <img
                            src={admin.profilePic}
                            alt="Admin"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <span className="absolute bottom-3 right-3 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                </div>
                {admin.name && (
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-800 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide mt-2">
                        {admin.name}
                    </div>
                )}
                <div className="uppercase text-xs tracking-widest text-purple-700 font-semibold mt-1">
                    Admin Dashboard
                </div>
            </div>
            <nav className="flex flex-col space-y-3 mt-4">
                <NavLink
                    to="/admin/dashboard" end 
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>🏠</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/admin/employees"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>👥</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Employees</span>
                </NavLink>
                <NavLink
                    to="/admin/departments"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>🏢</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Department</span>
                </NavLink>
                <NavLink
                    to="/admin/leave"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>📝</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Leave</span>
                </NavLink>
                <NavLink
                    to="/admin/salary"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>💸</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Salary</span>
                </NavLink>
                <NavLink
                    to="/admin/reports"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>📊</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Reports</span>
                </NavLink>
                <NavLink
                    to="/admin/events"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>📅</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Events</span>
                </NavLink>
                <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide flex items-center gap-2 ${
                            isActive
                                ? 'bg-purple-100 text-purple-700 shadow-inner'
                                : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                        }`
                    }
                >
                    <span>⚙️</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Settings</span>
                </NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar