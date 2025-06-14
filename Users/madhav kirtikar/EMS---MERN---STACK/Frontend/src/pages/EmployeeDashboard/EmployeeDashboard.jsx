 import React, { useEffect, useState } from "react";

// Dummy employee data (replace with backend data later)
const DUMMY_EMPLOYEE = {
  name: "Karan",
  position: "Developer",
};

const DUMMY_ATTENDANCE = [
  { date: "2024-06-01", status: "Present" },
  { date: "2024-06-02", status: "Present" },
  { date: "2024-06-03", status: "Absent" },
];

const DUMMY_LEAVES = [
  { date: "2024-06-05", status: "Approved" },
  { date: "2024-06-10", status: "Pending" },
];

const DUMMY_SALARY = [
  { month: "June 2024", amount: 50000 },
];

const EmployeeDashboard = ({ user }) => {
  // Use dummy data for now
  const [attendance, setAttendance] = useState(DUMMY_ATTENDANCE);
  const [leaves, setLeaves] = useState(DUMMY_LEAVES);
  const [salary, setSalary] = useState(DUMMY_SALARY[DUMMY_SALARY.length - 1]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Recent activity dummy logic
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
        `Payslip downloaded for ${salary.month}`
      );
    }
    setRecentActivity(acts);
  }, [attendance, leaves, salary]);

  // Use dummy employee if user prop not passed
  const employee = user || DUMMY_EMPLOYEE;

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
      label: salary ? `Salary (${salary.month})` : "Salary",
      value: salary ? `₹${salary.amount}` : "₹0",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {employee.name} 👋</h1>
      <p className="text-gray-600 mb-8">{employee.position}</p>
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