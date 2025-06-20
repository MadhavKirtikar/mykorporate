 import React, { useEffect, useState } from "react";
import axios from "axios";

// Dummy data for fallback/testing
const dummyEmployee = {
  name: "John Doe",
  position: "Software Engineer",
  email: "john@example.com",
  phone: "9876543210",
};
const dummyAttendance = [
  { date: "2024-06-01", status: "Present" },
  { date: "2024-06-02", status: "Absent" },
  { date: "2024-06-03", status: "Present" },
];
const dummyLeaves = [
  { date: "2024-06-05", status: "Approved" },
  { date: "2024-06-10", status: "Pending" },
];
const dummySalary = { month: "June", salary: 50000 };

const EmployeeDashboard = ({ user, useDummy = true }) => {
  const [employee, setEmployee] = useState(user || null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [salary, setSalary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch employee profile, attendance, leaves, salary from backend or dummy
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (useDummy) {
      setEmployee(user || dummyEmployee);
      setAttendance(dummyAttendance);
      setLeaves(dummyLeaves);
      setSalary(dummySalary);
      return;
    }
    if (!token) return;

    const fetchAll = async () => {
      try {
        // Profile
        let emp = user;
        if (!emp) {
          const res = await axios.get("/api/employee/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          emp = res.data;
        }
        setEmployee(emp);

        // Attendance
        const attRes = await axios.get("/api/attendance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttendance(Array.isArray(attRes.data) ? attRes.data : []);

        // Leaves
        const leaveRes = await axios.get("/api/leaves", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : []);

        // Salary (latest)
        const salRes = await axios.get("/api/payslips", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payslips = Array.isArray(salRes.data) ? salRes.data : [];
        setSalary(payslips.length ? payslips[payslips.length - 1] : null);
      } catch {
        // If any error, fallback to dummy if allowed
        if (useDummy) {
          setEmployee(user || dummyEmployee);
          setAttendance(dummyAttendance);
          setLeaves(dummyLeaves);
          setSalary(dummySalary);
        } else {
          setEmployee(user || null);
          setAttendance([]);
          setLeaves([]);
          setSalary(null);
        }
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [user, useDummy]);

  // Update dashboard if user prop changes (for live updates)
  useEffect(() => {
    if (user) setEmployee(user);
  }, [user]);

  useEffect(() => {
    // Recent activity logic
    const acts = [];
    if (attendance.length > 0) {
      const last = attendance[attendance.length - 1];
      acts.push(
        last.status === "Present"
          ? `Attendance marked for ${last.date}`
          : `Absent on ${last.date}`
      );
    }
    if (leaves.length > 0) {
      const lastLeave = leaves[leaves.length - 1];
      acts.push(
        `Leave applied for ${lastLeave.date} (${lastLeave.status})`
      );
    }
    if (salary) {
      acts.push(
        `Payslip downloaded for ${salary.month || salary.date || "recent month"}`
      );
    }
    setRecentActivity(acts);
  }, [attendance, leaves, salary]);

  const stats = [
    {
      label: "Attendance",
      value: attendance.length
        ? `${Math.round(
            (attendance.filter((a) => a.status === "Present").length / attendance.length) * 100
          )}%`
        : "0%",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Leaves Used",
      value: `${leaves.filter((l) => l.status === "Approved").length} / 12`,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: salary ? `Salary (${salary.month || salary.date || "Recent"})` : "Salary",
      value: salary && salary.salary
        ? `₹${salary.salary}`
        : salary && salary.amount
        ? `₹${salary.amount}`
        : "₹0",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  if (!employee) {
    return (
      <div className="p-6 text-center text-gray-400 text-xl">
        Loading employee data...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {employee.name} 👋</h1>
      <p className="text-gray-600 mb-2">{employee.position}</p>
      <p className="text-gray-500 mb-8 text-sm">
        Email: {employee.email} | Phone: {employee.phone}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className={`p-4 rounded-xl shadow ${item.color}`}>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="list-disc pl-4 space-y-2 text-gray-700">
          {recentActivity.length > 0 ? (
            recentActivity.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))
          ) : (
            <li>No recent activity found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;