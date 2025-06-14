 import React, { useState } from "react"
import Navbar from "./Component/Navbar/Navbar.jsx"
import Hero from "./Component/Hero/Hero.jsx"
import Features from "./Component/Features/features.jsx"
import Title from "./Component/Title/title.jsx"
import Login from "./Component/Login/login.jsx"
import ForgotPassword from "./Component/Login/ForgotPassword.jsx"
import About from "./Component/About/about.jsx"
import Admin from "./pages/AdminDashboard/AdminDashboard.jsx"
import AdminSettings from "./Component/Dashboard/Settings.jsx"
import Salary from "./Component/Dashboard/Salary.jsx"
import Leave from "./Component/Dashboard/Leave.jsx"
import Dashboard from "./Component/Dashboard/Dashboard.jsx"
import Department from "./Component/Dashboard/Department.jsx"
import Employee from "./Component/Dashboard/Employee.jsx"
import Contacts from "./Component/Contact/Contacts.jsx"
import Reports from "./Component/Dashboard/Reports.jsx"
import Events from "./Component/Dashboard/Events.jsx"
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import EmployeeLayout from "./pages/EmployeeDashboard/EmployeeLayout.jsx";
import MyProfile from "./Component/EMPDashboard/MyProfile.jsx";
import Attendance from "./Component/EMPDashboard/Attendance.jsx"
import SalaryPayslips from "./Component/EMPDashboard/SalaryPayslips.jsx"
import CalenderEvents from "./Component/EMPDashboard/CalenderEvents.jsx"
import Notifications from "./Component/EMPDashboard/Notifications.jsx"
import Leaves from "./Component/EMPDashboard/Leaves.jsx"
import Chatbot from "./Component/CGPT/Chatbot.jsx";
import Settings from "./Component/EMPDashboard/Settings.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

// Profile state ko yahan define karo taki sab jagah same profile dikhe
const defaultProfile = {
  name: "Amit Kumar",
  email: "amit@demo.com",
  phone: "9876543210",
  department: "HR",
  address: "Delhi",
  joiningDate: "2023-01-15",
  position: "Manager",
  photo: "",
};

function App() {
  const [employees, setEmployees] = useState([])
  const [profile, setProfile] = useState(defaultProfile)
  const user = { name: profile.name, position: profile.position }

  return (
    <Router>
      <div className="bg-blue-100 min-h-screen">
        <Navbar profile={profile} />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Title />
              <Features />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/salary" element={<Salary />} />
          <Route path="/admin/leave" element={<Leave />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/employees" element={<Employee employees={employees} setEmployees={setEmployees} />} />
          <Route path="/admin/departments" element={<Department />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route
            path="/emp"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <EmployeeDashboard user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/profile"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <MyProfile profile={profile} setProfile={setProfile} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/attendance"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <Attendance user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/salary"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <SalaryPayslips user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/calendar"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <CalenderEvents user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/notifications"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <Notifications user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/leave"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <Leaves user={user} />
              </EmployeeLayout>
            }
          />
          <Route
            path="/emp/settings"
            element={
              <EmployeeLayout user={user} profile={profile}>
                <Settings profile={profile} setProfile={setProfile} />
              </EmployeeLayout>
            }
          />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App