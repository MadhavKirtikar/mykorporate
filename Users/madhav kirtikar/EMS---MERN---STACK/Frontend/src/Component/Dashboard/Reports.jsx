 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const USE_DUMMY = true; // true: dummy data, false: backend data

const COLORS = ["#a78bfa", "#818cf8", "#38bdf8", "#f472b6", "#facc15", "#34d399", "#f87171", "#fbbf24", "#60a5fa", "#f472b6"];
const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DUMMY_EMPLOYEES = [
  { _id: "1", name: "Amit", department: "HR", salary: 50000, performance: 4.5, leaves: 2, salaryMonth: "June" },
  { _id: "2", name: "Priya", department: "IT", salary: 60000, performance: 4.2, leaves: 1, salaryMonth: "June" },
  { _id: "3", name: "Ravi", department: "Finance", salary: 45000, performance: 3.9, leaves: 3, salaryMonth: "May" },
  { _id: "4", name: "Sonal", department: "HR", salary: 52000, performance: 4.8, leaves: 0, salaryMonth: "May" },
  { _id: "5", name: "Deepak", department: "IT", salary: 61000, performance: 4.1, leaves: 2, salaryMonth: "April" },
];

const DUMMY_DEPARTMENTS = [
  { name: "HR" },
  { name: "IT" },
  { name: "Finance" },
];

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tab, setTab] = useState("salary");
  const [search, setSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    // Backend or Dummy API calls
    const fetchData = async () => {
      if (USE_DUMMY) {
        setEmployees(DUMMY_EMPLOYEES);
        setDepartments(DUMMY_DEPARTMENTS);
        return;
      }
      try {
        const [empRes, deptRes] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/departments"),
        ]);
        setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      } catch {
        setEmployees(DUMMY_EMPLOYEES);
        setDepartments(DUMMY_DEPARTMENTS);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (emp.department || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  const getDepartmentStats = (emps) => {
    const stats = {};
    emps.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = { count: 0, totalSalary: 0, totalPerformance: 0 };
      }
      stats[emp.department].count += 1;
      stats[emp.department].totalSalary += emp.salary || emp.amount || 0;
      stats[emp.department].totalPerformance += emp.performance || 0;
    });
    return stats;
  };

  const departmentStats = getDepartmentStats(employees);

  const overallPerformance =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + (emp.performance || 0), 0) / employees.length
      : 0;

  const overallLeaves = employees.reduce((sum, emp) => sum + (emp.leaves || 0), 0);

  const showSalary = employees.length > 0;
  const showDepartment = departments.length > 0 && employees.length > 0;
  const showPerformance = employees.some(emp => emp.performance);
  const showLeave = employees.some(emp => emp.leaves > 0);
  const showAnalytics = employees.length > 0 && departments.length > 0;

  const nothingToShow = !showSalary && !showDepartment && !showPerformance && !showLeave && !showAnalytics;

  const exportPDF = (section = "salary") => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#6D28D9");
    if (section === "salary") {
      doc.text("Employee Salary Report", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Total Employees: ${(filteredEmployees.length > 0 ? filteredEmployees : employees).length}`, 14, 28);
      doc.text(`Total Salary: ₹${(filteredEmployees.length > 0 ? filteredEmployees : employees).reduce((sum, emp) => sum + (emp.salary || emp.amount || 0), 0)}`, 14, 36);
      autoTable(doc, {
        startY: 44,
        head: [["Name", "Department", "Salary"]],
        body: (filteredEmployees.length > 0 ? filteredEmployees : employees).map(emp => [
          emp.name,
          emp.department,
          `₹${emp.salary || emp.amount || 0}`
        ]),
        theme: "striped",
        headStyles: { fillColor: [167, 139, 250], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [243, 232, 255] }
      });
    }
    if (section === "department") {
      doc.text("Department Report", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Total Departments: ${departments.length}`, 14, 28);
      autoTable(doc,{
        startY: 36,
        head: [["Department", "Employees", "Total Salary"]],
        body: Object.entries(departmentStats).map(([dept, stat]) => [
          dept,
          stat.count,
          `₹${stat.totalSalary}`
        ]),
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [219, 234, 254] }
      });
    }
    if (section === "performance") {
      doc.text("Performance Report", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Overall Avg. Performance: ${overallPerformance.toFixed(2)} ⭐`, 14, 28);
      autoTable(doc, {
        startY: 36,
        head: [["Name", "Department", "Performance"]],
        body: (filteredEmployees.length > 0 ? filteredEmployees : employees).map(emp => [
          emp.name,
          emp.department,
          `${emp.performance || 0} ⭐`
        ]),
        theme: "striped",
        headStyles: { fillColor: [250, 204, 21], textColor: 55, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [254, 243, 199] }
      });
    }
    if (section === "leave") {
      doc.text("Leave Report", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Total Leaves: ${overallLeaves}`, 14, 28);
      autoTable(doc,{
        startY: 36,
        head: [["Name", "Department", "Leaves"]],
        body: (filteredEmployees.length > 0 ? filteredEmployees : employees)
          .filter(emp => emp.leaves > 0)
          .map(emp => [
            emp.name,
            emp.department,
            emp.leaves
          ]),
        theme: "striped",
        headStyles: { fillColor: [236, 72, 153], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [252, 231, 243] }
      });
    }
    if (section === "analytics") {
      doc.text("Analytics Report", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Total Employees: ${employees.length}`, 14, 28);
      doc.text(`Departments: ${departments.length}`, 14, 36);
      doc.text(`Total Salary: ₹${employees.reduce((sum, emp) => sum + (emp.salary || emp.amount || 0), 0)}`, 14, 44);
      doc.text(`Overall Avg. Performance: ${overallPerformance.toFixed(2)}`, 14, 52);
      doc.text(`Total Leaves: ${overallLeaves}`, 14, 60);
      autoTable(doc, {
        startY: 68,
        head: [["Department", "Employees"]],
        body: Object.entries(departmentStats).map(([dept, stat]) => [
          dept,
          stat.count
        ]),
        theme: "striped",
        headStyles: { fillColor: [167, 139, 250], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [243, 232, 255] }
      });
    }
    doc.save(`${section}-report.pdf`);
  };

  // Top performers logic
  const topPerformers = [...employees]
    .filter(emp => emp.performance)
    .sort((a, b) => (b.performance || 0) - (a.performance || 0))
    .slice(0, 3);

  const mostLeaves = [...employees]
    .filter(emp => emp.leaves > 0)
    .sort((a, b) => (b.leaves || 0) - (a.leaves || 0))
    .slice(0, 3);

  const pieData = Object.entries(departmentStats).map(([dept, stat]) => ({
    name: dept,
    value: stat.count,
  }));

  const salaryByMonth = {};
  const leavesByMonth = {};
  employees.forEach(emp => {
    const month = emp.salaryMonth || emp.month;
    if (month && (emp.salary || emp.amount)) {
      salaryByMonth[month] = (salaryByMonth[month] || 0) + (emp.salary || emp.amount || 0);
    }
    if (month && emp.leaves && emp.status !== "Pending") {
      leavesByMonth[month] = (leavesByMonth[month] || 0) + emp.leaves;
    }
  });
  const barData = monthOrder.map(month => ({
    month,
    total: salaryByMonth[month] || 0,
    leaves: leavesByMonth[month] || 0,
  }));

  const avgPerformanceByDept = Object.entries(departmentStats).map(([dept, stat]) => ({
    department: dept,
    avgPerformance: stat.count ? (stat.totalPerformance / stat.count).toFixed(2) : 0,
  }));

  const tabButtons = [
    showSalary && { key: "salary", label: "Salary" },
    showDepartment && { key: "department", label: "Departments" },
    showAnalytics && { key: "analytics", label: "Analytics" },
    showPerformance && { key: "performance", label: "Performance" },
    showLeave && { key: "leave", label: "Leave" },
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
      <main className="flex-1 p-2 md:p-8 ml-0 md:ml-64">
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Reports & Analytics
            </span>
          </h1>

          {/* Top Performers Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">🏆 Top Employees</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {topPerformers.length === 0 ? (
                <div className="text-gray-400 text-center">No performance data available.</div>
              ) : (
                topPerformers.map((emp, idx) => (
                  <div
                    key={emp._id}
                    className={`flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border-2 ${
                      idx === 0
                        ? "border-yellow-400"
                        : idx === 1
                        ? "border-gray-400"
                        : "border-orange-400"
                    }`}
                    style={{ minWidth: 180 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-green-300 flex items-center justify-center mb-2 shadow">
                      <span className="text-2xl font-bold text-white">{emp.name[0]}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-800">{emp.name}</div>
                    <div className="text-sm text-gray-500 mb-1">{emp.department}</div>
                    <div className="flex items-center gap-1 text-yellow-600 font-bold text-lg">
                      {emp.performance} <span>⭐</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {idx === 0 && "🥇 1st"}
                      {idx === 1 && "🥈 2nd"}
                      {idx === 2 && "🥉 3rd"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-between items-center mb-8 bg-gradient-to-r from-purple-100 via-blue-50 to-white rounded-2xl shadow p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {tabButtons.map(tabBtn => (
                <button
                  key={tabBtn.key}
                  className={`px-6 py-2 rounded-full font-bold shadow text-base transition-all duration-200 ${
                    tab === tabBtn.key
                      ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white scale-105"
                      : "bg-white text-purple-700 border-2 border-purple-200 hover:bg-purple-100"
                  }`}
                  onClick={() => setTab(tabBtn.key)}
                >
                  {tabBtn.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto mt-4 md:mt-0 justify-center md:justify-end">
              {(tab === "salary" || tab === "performance" || tab === "leave") && (
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search by name or department"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 outline-none text-base w-full shadow"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-400 pointer-events-none">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" stroke="#a78bfa" strokeWidth="2"/>
                      <path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/>
                    </svg>
                  </span>
                  {search && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      tabIndex={-1}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {tab === "salary" && (
                <button
                  className="ml-2 px-5 py-2 rounded-full font-semibold shadow text-base bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 transition"
                  onClick={() => exportPDF("salary")}
                >
                  Download PDF
                </button>
              )}
              {tab === "department" && (
                <button
                  className="ml-2 px-5 py-2 rounded-full font-semibold shadow text-base bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition"
                  onClick={() => exportPDF("department")}
                >
                  Download PDF
                </button>
              )}
              {tab === "performance" && (
                <button
                  className="ml-2 px-5 py-2 rounded-full font-semibold shadow text-base bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 transition"
                  onClick={() => exportPDF("performance")}
                >
                  Download PDF
                </button>
              )}
              {tab === "leave" && (
                <button
                  className="ml-2 px-5 py-2 rounded-full font-semibold shadow text-base bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:from-pink-500 hover:to-pink-700 transition"
                  onClick={() => exportPDF("leave")}
                >
                  Download PDF
                </button>
              )}
              {tab === "analytics" && (
                <button
                  className="ml-2 px-5 py-2 rounded-full font-semibold shadow text-base bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 transition"
                  onClick={() => exportPDF("analytics")}
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>
          {nothingToShow && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center text-gray-500 text-xl flex flex-col items-center justify-center gap-4">
              <span className="animate-bounce">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="4" height="10" rx="1" fill="#a78bfa"/>
                  <rect x="9.5" y="7" width="4" height="14" rx="1" fill="#818cf8"/>
                  <rect x="16" y="3" width="4" height="18" rx="1" fill="#38bdf8"/>
                </svg>
              </span>
              No data available for reports. Please add employees, departments, leaves, etc.
            </div>
          )}
          {/* ...rest of your existing tab content code remains unchanged... */}
          {tab === "salary" && showSalary && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-green-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-green-700">₹{(filteredEmployees.length > 0 ? filteredEmployees : employees).reduce((sum, emp) => sum + (emp.salary || emp.amount || 0), 0)}</div>
                  <div className="text-gray-600">Total Salary</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-blue-700">{filteredEmployees.length > 0 ? filteredEmployees.length : employees.length}</div>
                  <div className="text-gray-600">Employees</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" stroke="#34d399" fill="#bbf7d0" name="Monthly Salary" />
                </AreaChart>
              </ResponsiveContainer>
              <table className="min-w-full divide-y divide-purple-100 mt-6">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-purple-700 uppercase">Salary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {(filteredEmployees.length > 0 ? filteredEmployees : employees).map(emp => (
                    <tr key={emp._id}>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2 text-right">₹{emp.salary || emp.amount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* ...rest of your existing tab content code remains unchanged... */}
          {tab === "department" && showDepartment && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="mb-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <PieChart width={300} height={220}>
                    <Pie
                      data={pieData}
                      cx={140}
                      cy={110}
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-4 text-purple-700">Department Report</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={avgPerformanceByDept}>
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgPerformance" fill="#818cf8" name="Avg. Performance" />
                    </BarChart>
                  </ResponsiveContainer>
                  <table className="min-w-full divide-y divide-purple-100 mt-4">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                        <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Employees</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-purple-700 uppercase">Total Salary</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-50">
                      {Object.entries(departmentStats).map(([dept, stat]) => (
                        <tr key={dept}>
                          <td className="px-4 py-2">{dept}</td>
                          <td className="px-4 py-2 text-center">{stat.count}</td>
                          <td className="px-4 py-2 text-right">₹{stat.totalSalary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === "performance" && showPerformance && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-yellow-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-yellow-700">{overallPerformance.toFixed(2)} ⭐</div>
                  <div className="text-gray-600">Avg. Performance</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-blue-700">{filteredEmployees.length > 0 ? filteredEmployees.length : employees.length}</div>
                  <div className="text-gray-600">Employees</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={employees}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#facc15" name="Performance" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mb-4 flex flex-wrap gap-4 mt-4">
                {topPerformers.map(emp => (
                  <div key={emp._id} className="bg-yellow-100 rounded-lg px-4 py-2 flex items-center gap-2 shadow">
                    <span className="text-lg font-bold text-yellow-700">{emp.name}</span>
                    <span className="text-gray-600">({emp.department})</span>
                    <span className="text-yellow-700 font-bold">{emp.performance} ⭐</span>
                  </div>
                ))}
              </div>
              <table className="min-w-full divide-y divide-purple-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {(filteredEmployees.length > 0 ? filteredEmployees : employees).map(emp => (
                    <tr key={emp._id}>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2 text-center">{emp.performance || 0} ⭐</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "leave" && showLeave && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-pink-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-pink-700">{overallLeaves}</div>
                  <div className="text-gray-600">Total Leaves</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center">
                  <div className="text-lg font-bold text-blue-700">{filteredEmployees.length > 0 ? filteredEmployees.length : employees.length}</div>
                  <div className="text-gray-600">Employees</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leaves" fill="#f472b6" name="Leaves" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mb-4 flex flex-wrap gap-4 mt-4">
                {mostLeaves.map(emp => (
                  <div key={emp._id} className="bg-pink-100 rounded-lg px-4 py-2 flex items-center gap-2 shadow">
                    <span className="text-lg font-bold text-pink-700">{emp.name}</span>
                    <span className="text-gray-600">({emp.department})</span>
                    <span className="text-pink-700 font-bold">{emp.leaves} Leaves</span>
                  </div>
                ))}
              </div>
              <table className="min-w-full divide-y divide-purple-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Leaves</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {(filteredEmployees.length > 0 ? filteredEmployees : employees)
                    .filter(emp => emp.leaves > 0)
                    .map(emp => (
                      <tr key={emp._id}>
                        <td className="px-4 py-2">{emp.name}</td>
                        <td className="px-4 py-2">{emp.department}</td>
                        <td className="px-4 py-2 text-center">{emp.leaves}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "analytics" && showAnalytics && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4 text-purple-700">Overall Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-100 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl font-bold text-purple-700">{employees.length}</div>
                  <div className="text-gray-600">Total Employees</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl font-bold text-blue-700">{departments.length}</div>
                  <div className="text-gray-600">Departments</div>
                </div>
                <div className="bg-green-100 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl font-bold text-green-700">₹{employees.reduce((sum, emp) => sum + (emp.salary || emp.amount || 0), 0)}</div>
                  <div className="text-gray-600">Total Salary</div>
                </div>
                <div className="bg-yellow-100 rounded-xl p-6 text-center shadow md:col-span-2">
                  <div className="text-2xl font-bold text-yellow-700">{overallPerformance.toFixed(2)} ⭐</div>
                  <div className="text-gray-600">Overall Avg. Performance</div>
                </div>
                <div className="bg-pink-100 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl font-bold text-pink-700">{overallLeaves}</div>
                  <div className="text-gray-600">Total Leaves</div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 text-purple-700">Department Wise Employees</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 text-purple-700">Monthly Salary Payout</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#6366f1" name="Salary" />
                  </BarChart>
                </ResponsiveContainer>
                {barData.every(item => item.total === 0) && (
                  <div className="text-center text-gray-400 mt-4">No salary data available for any month.</div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-purple-700">Monthly Leaves Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leaves" stroke="#f472b6" name="Leaves" />
                  </LineChart>
                </ResponsiveContainer>
                {barData.every(item => item.leaves === 0) && (
                  <div className="text-center text-gray-400 mt-4">No leave data available for any month.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;