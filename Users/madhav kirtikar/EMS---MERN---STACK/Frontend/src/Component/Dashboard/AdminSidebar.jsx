 import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const AdminSidebar = ({ profilePicUrl }) => {
    const location = useLocation();

    // Profile image priority: prop → localStorage → default
    const profilePic =
        profilePicUrl ||
        localStorage.getItem("adminProfilePic") ||
        "https://randomuser.me/api/portraits/men/32.jpg";

    // Dummy admin data, replace with real data from context or backend
    const admin = {
        name: "Admin User",
        profilePic
    };

    return (
        <div className="bg-white/40 backdrop-blur-md text-black h-screen fixed left-0 top-0 bottom-0 w-72 px-6 py-4 space-y-6 shadow-xl border-r border-white/20">
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
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-800 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide mt-2">
                    {admin.name}
                </div>
                <div className="uppercase text-xs tracking-widest text-purple-700 font-semibold mt-1">
                    Admin Dashboard
                </div>
            </div>
            <div className="flex flex-col space-y-3 mt-4">
                <NavLink
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/dashboard'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">🏠</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Dashboard</span>
                </NavLink>
                <NavLink
                    to="/admin/employees"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/employees'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">👥</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Employees</span>
                </NavLink>
                <NavLink
                    to="/admin/departments"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/departments'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">🏢</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Department</span>
                </NavLink>
                <NavLink
                    to="/admin/leave"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/leave'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">📝</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Leave</span>
                </NavLink>
                <NavLink
                    to="/admin/salary"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/salary'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">💸</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Salary</span>
                </NavLink>
                <NavLink
                    to="/admin/reports"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/reports'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">📊</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Reports</span>
                </NavLink>
                <NavLink
                    to="/admin/events"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/events'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">📅</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Events</span>
                </NavLink>
                <NavLink
                    to="/admin/settings"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 text-lg font-semibold tracking-wide ${
                        location.pathname === '/admin/settings'
                            ? 'bg-purple-100 text-purple-700 shadow-inner'
                            : 'text-black hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-500 hover:text-white hover:shadow-md'
                    }`}
                >
                    <span className="inline-block mr-2">⚙️</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text text-transparent">Settings</span>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminSidebar