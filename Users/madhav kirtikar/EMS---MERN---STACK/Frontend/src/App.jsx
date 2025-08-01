 import React, { useEffect, useState } from "react";
import SplashScreen from "./Component/IntroAnimation/SplashScreen.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Hero from "./Component/Hero/Hero.jsx";
import Features from "./Component/Features/features.jsx";
import Title from "./Component/Title/title.jsx";
import Login from "./Component/Login/login.jsx";
import ForgotPassword from "./Component/Login/ForgotPassword.jsx";
import About from "./Component/About/about.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import AdminSettings from "./Component/Dashboard/Settings.jsx";
import Salary from "./Component/Dashboard/Salary.jsx";
import Leave from "./Component/Dashboard/Leave.jsx";
import Department from "./Component/Dashboard/Department.jsx";
import Employee from "./Component/Dashboard/Employee.jsx";
import Contacts from "./Component/Contact/Contacts.jsx";
import Reports from "./Component/Dashboard/Reports.jsx";
import Events from "./Component/Dashboard/Events.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import EmployeeLayout from "./pages/EmployeeDashboard/EmployeeLayout.jsx";
import MyProfile from "./Component/EMPDashboard/MyProfile.jsx";
import Attendance from "./Component/EMPDashboard/Attendance.jsx";
import SalaryPayslips from "./Component/EMPDashboard/SalaryPayslips.jsx";
import CalenderEvents from "./Component/EMPDashboard/CalenderEvents.jsx";
import Notifications from "./Component/EMPDashboard/Notifications.jsx";
import Leaves from "./Component/EMPDashboard/Leaves.jsx";
import Chatbot from "./Component/CGPT/Chatbot.jsx";
import Settings from "./Component/EMPDashboard/Settings.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext"; // 👈 useAuth hook

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

function MainApp() {
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);

  const { user } = useAuth(); // 👈 get user from context

  return (
     
      <div className="bg-blue-100 min-h-screen">
        <Navbar profile={profile} />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Title />
                <Features />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/chatbot" element={<Chatbot />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salary"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Salary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leave"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Leave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Employee
                  employees={employees}
                  setEmployees={setEmployees}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Contacts />
              </ProtectedRoute>
            }
          />

          {/* Employee Protected Routes */}
          <Route
            path="/emp"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <EmployeeDashboard user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/profile"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <MyProfile profile={profile} setProfile={setProfile} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/attendance"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <Attendance user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/salary"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <SalaryPayslips user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/calendar"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <CalenderEvents user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/notifications"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <Notifications user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/leave"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <Leaves user={user} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emp/settings"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout user={user} profile={profile}>
                  <Settings profile={profile} setProfile={setProfile} />
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <MainApp />;
}

export default App;
