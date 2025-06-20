 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const USE_DUMMY = true;

const COLORS = [
  "#a78bfa", "#818cf8", "#38bdf8", "#f472b6", "#facc15",
  "#34d399", "#f87171", "#fbbf24", "#60a5fa", "#f472b6"
];
const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DUMMY_EMPLOYEES = [
  { _id: "1", name: "Amit", department: "HR", salary: 50000, performance: 4.5, leaves: 2, salaryMonth: "June", joinDate: "2024-01-10", exitDate: null, attendance: { "2024-06": 22, "2024-05": 20 } },
  { _id: "2", name: "Priya", department: "IT", salary: 60000, performance: 4.2, leaves: 1, salaryMonth: "June", joinDate: "2024-03-15", exitDate: null, attendance: { "2024-06": 21, "2024-05": 22 } },
  { _id: "3", name: "Ravi", department: "Finance", salary: 45000, performance: 3.9, leaves: 3, salaryMonth: "May", joinDate: "2023-12-01", exitDate: null, attendance: { "2024-06": 18, "2024-05": 19 } },
  { _id: "4", name: "Sonal", department: "HR", salary: 52000, performance: 4.8, leaves: 0, salaryMonth: "May", joinDate: "2024-02-01", exitDate: null, attendance: { "2024-06": 23, "2024-05": 22 } },
  { _id: "5", name: "Deepak", department: "IT", salary: 61000, performance: 4.1, leaves: 2, salaryMonth: "April", joinDate: "2024-01-20", exitDate: "2024-06-01", attendance: { "2024-06": 0, "2024-05": 20 } },
];

const DUMMY_DEPARTMENTS = [
  { name: "HR" },
  { name: "IT" },
  { name: "Finance" },
];

const getMonthYear = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${monthOrder[d.getMonth()]} ${d.getFullYear()}`;
};

const TAB_CONFIG = [
  { key: "salary", label: "💰 Salary" },
  { key: "department", label: "🏢 Departments" },
  { key: "analytics", label: "📈 Analytics" },
  { key: "performance", label: "🌟 Performance" },
  { key: "leave", label: "🗓️ Leave" },
  { key: "attendance", label: "🕒 Attendance" },
  { key: "turnover", label: "🔄 Turnover" },
  { key: "insights", label: "💡 Insights" },
  { key: "employee", label: "👤 Employee Report" },
];

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [tab, setTab] = useState("salary");
  const [search, setSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedEmp, setSelectedEmp] = useState(null);

  useEffect(() => {
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

  // Date range filter
  const filterByDateRange = (emps) => {
    if (!dateRange.from && !dateRange.to) return emps;
    return emps.filter(emp => {
      const join = emp.joinDate ? new Date(emp.joinDate) : null;
      const exit = emp.exitDate ? new Date(emp.exitDate) : null;
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      if (from && join && join < from) return false;
      if (to && join && join > to) return false;
      if (to && exit && exit < from) return false;
      return true;
    });
  };

  useEffect(() => {
    let emps = employees;
    if (search) {
      emps = emps.filter(
        (emp) =>
          (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (emp.department || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    emps = filterByDateRange(emps);
    setFilteredEmployees(emps);
  }, [search, employees, dateRange]);

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

  const departmentStats = getDepartmentStats(filteredEmployees.length > 0 ? filteredEmployees : employees);

  const overallPerformance =
    (filteredEmployees.length > 0 ? filteredEmployees : employees).length > 0
      ? (filteredEmployees.length > 0 ? filteredEmployees : employees).reduce((sum, emp) => sum + (emp.performance || 0), 0) /
        (filteredEmployees.length > 0 ? filteredEmployees : employees).length
      : 0;

  const overallLeaves = (filteredEmployees.length > 0 ? filteredEmployees : employees).reduce((sum, emp) => sum + (emp.leaves || 0), 0);

  const showSalary = employees.length > 0;
  const showDepartment = departments.length > 0 && employees.length > 0;
  const showPerformance = employees.some(emp => emp.performance);
  const showLeave = employees.some(emp => emp.leaves > 0);
  const showAnalytics = employees.length > 0 && departments.length > 0;

  const nothingToShow = !showSalary && !showDepartment && !showPerformance && !showLeave && !showAnalytics;

  // Attendance Analytics
  const attendanceMonths = monthOrder.map((m, idx) => {
    const year = "2024";
    return `${m} ${year}`;
  });
  const attendanceData = attendanceMonths.map(month => {
    let present = 0, total = 0;
    employees.forEach(emp => {
      if (emp.attendance && emp.attendance[month.replace(" 2024", "")]) {
        present += emp.attendance[month.replace(" 2024", "")];
        total += 22; // Assume 22 working days per month
      }
    });
    return {
      month,
      attendancePercent: total ? ((present / total) * 100).toFixed(1) : 0,
    };
  });

  // Salary Growth Trend
  const salaryByMonth = {};
  employees.forEach(emp => {
    const month = emp.salaryMonth || emp.month;
    if (month && (emp.salary || emp.amount)) {
      salaryByMonth[month] = (salaryByMonth[month] || 0) + (emp.salary || emp.amount || 0);
    }
  });
  const salaryGrowthData = monthOrder.map(month => ({
    month,
    total: salaryByMonth[month] || 0,
  }));

  // Department Comparison
  const avgSalaryByDept = Object.entries(getDepartmentStats(employees)).map(([dept, stat]) => ({
    department: dept,
    avgSalary: stat.count ? (stat.totalSalary / stat.count).toFixed(0) : 0,
    avgPerformance: stat.count ? (stat.totalPerformance / stat.count).toFixed(2) : 0,
    count: stat.count,
  }));

  // Employee Turnover
  const turnoverData = monthOrder.map((month, idx) => {
    const year = 2024;
    const monthNum = idx + 1;
    const joiners = employees.filter(emp => {
      if (!emp.joinDate) return false;
      const d = new Date(emp.joinDate);
      return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
    }).length;
    const exits = employees.filter(emp => {
      if (!emp.exitDate) return false;
      const d = new Date(emp.exitDate);
      return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
    }).length;
    return { month, joiners, exits };
  });

  // Top punctual employees
  const punctualEmployees = [...employees]
    .map(emp => {
      const totalDays = Object.values(emp.attendance || {}).reduce((a, b) => a + b, 0);
      const months = Object.keys(emp.attendance || {}).length || 1;
      return { ...emp, avgAttendance: (totalDays / (months * 22)) * 100 };
    })
    .sort((a, b) => (b.avgAttendance || 0) - (a.avgAttendance || 0))
    .slice(0, 3);

  // Insights
  const insights = [
    punctualEmployees[0] && `Most punctual: ${punctualEmployees[0].name} (${punctualEmployees[0].avgAttendance?.toFixed(1)}%)`,
    avgSalaryByDept.length > 0 && `Highest avg salary: ${avgSalaryByDept.reduce((a, b) => (+a.avgSalary > +b.avgSalary ? a : b)).department}`,
    avgSalaryByDept.length > 0 && `Best avg performance: ${avgSalaryByDept.reduce((a, b) => (+a.avgPerformance > +b.avgPerformance ? a : b)).department}`,
    employees.length > 0 && `Top performer: ${[...employees].sort((a, b) => (b.performance || 0) - (a.performance || 0))[0]?.name}`,
    employees.length > 0 && `Most leaves: ${[...employees].sort((a, b) => (b.leaves || 0) - (a.leaves || 0))[0]?.name}`,
  ].filter(Boolean);

  // PDF Export
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
        head: [["Department", "Employees", "Avg Salary", "Avg Performance"]],
        body: avgSalaryByDept.map(stat => [
          stat.department,
          stat.count,
          `₹${stat.avgSalary}`,
          stat.avgPerformance
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

  const barData = monthOrder.map(month => ({
    month,
    total: salaryByMonth[month] || 0,
    leaves: employees.reduce((sum, emp) => sum + ((emp.salaryMonth === month && emp.leaves) ? emp.leaves : 0), 0),
  }));

  // Tab visibility logic
  const visibleTabs = TAB_CONFIG.filter(tabObj => {
    if (tabObj.key === "salary") return showSalary;
    if (tabObj.key === "department") return showDepartment;
    if (tabObj.key === "analytics") return showAnalytics;
    if (tabObj.key === "performance") return showPerformance;
    if (tabObj.key === "leave") return showLeave;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#ede9fe] via-[#f0f9ff] to-[#fdf2f8]">
      <AdminSidebar />
      <main className="flex-1 p-2 md:p-8 ml-0 md:ml-64">
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
             
              Reports & Analytics
            </span>
          </h1>

          {/* Top Performers Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-3xl">🏆</span> Top Employees
            </h2>
            <div className="flex flex-wrap gap-8 justify-center">
              {topPerformers.length === 0 ? (
                <div className="text-gray-400 text-center">No performance data available.</div>
              ) : (
                topPerformers.map((emp, idx) => (
                  <div
                    key={emp._id}
                    className={`flex flex-col items-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-4 transition-all duration-300 hover:scale-105 ${
                      idx === 0
                        ? "border-yellow-400"
                        : idx === 1
                        ? "border-gray-400"
                        : "border-orange-400"
                    }`}
                    style={{ minWidth: 200 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-green-300 flex items-center justify-center mb-3 shadow-lg border-4 border-white">
                      <span className="text-3xl font-bold text-white">{emp.name[0]}</span>
                    </div>
                    <div className="text-xl font-bold text-purple-800">{emp.name}</div>
                    <div className="text-base text-gray-500 mb-1">{emp.department}</div>
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

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-between items-center mb-10 bg-gradient-to-r from-purple-100 via-blue-50 to-white rounded-3xl shadow-lg p-6">
            <div className="flex flex-wrap gap-3 items-center">
              {visibleTabs.map(tabBtn => (
                <button
                  key={tabBtn.key}
                  className={`px-7 py-2 rounded-full font-bold shadow text-base transition-all duration-200 border-2 ${
                    tab === tabBtn.key
                      ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white scale-110 border-purple-400"
                      : "bg-white text-purple-700 border-purple-200 hover:bg-purple-100"
                  }`}
                  onClick={() => setTab(tabBtn.key)}
                >
                  {tabBtn.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto mt-4 md:mt-0 justify-center md:justify-end">
              {(tab === "salary" || tab === "performance" || tab === "leave") && (
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by name or department"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 outline-none text-base w-full shadow bg-white/80"
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
              {/* Date Range Filter */}
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
                  className="border border-purple-200 rounded px-2 py-1 bg-white/80"
                  placeholder="From"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
                  className="border border-purple-200 rounded px-2 py-1 bg-white/80"
                  placeholder="To"
                />
                {(dateRange.from || dateRange.to) && (
                  <button
                    className="text-xs text-purple-500 underline ml-2"
                    onClick={() => setDateRange({ from: "", to: "" })}
                  >
                    Clear
                  </button>
                )}
              </div>
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

          {/* --- Tab Content --- */}
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

          {/* Salary Tab */}
          {tab === "salary" && showSalary && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span>💰</span> Salary Overview</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-green-100 rounded-xl p-4 flex-1 text-center shadow">
                  <div className="text-lg font-bold text-green-700">₹{(filteredEmployees.length > 0 ? filteredEmployees : employees).reduce((sum, emp) => sum + (emp.salary || emp.amount || 0), 0)}</div>
                  <div className="text-gray-600">Total Salary</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center shadow">
                  <div className="text-lg font-bold text-blue-700">{filteredEmployees.length > 0 ? filteredEmployees.length : employees.length}</div>
                  <div className="text-gray-600">Employees</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={salaryGrowthData}>
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

          {/* Departments Tab */}
          {tab === "department" && showDepartment && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2"><span>🏢</span> Departments Overview</h2>
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
                  <h3 className="text-lg font-bold mb-4 text-purple-700">Department Comparison</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={avgSalaryByDept}>
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgSalary" fill="#34d399" name="Avg. Salary" />
                      <Bar dataKey="avgPerformance" fill="#818cf8" name="Avg. Performance" />
                    </BarChart>
                  </ResponsiveContainer>
                  <table className="min-w-full divide-y divide-purple-100 mt-4">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                        <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Employees</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-purple-700 uppercase">Avg Salary</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-purple-700 uppercase">Avg Performance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-50">
                      {avgSalaryByDept.map(stat => (
                        <tr key={stat.department}>
                          <td className="px-4 py-2">{stat.department}</td>
                          <td className="px-4 py-2 text-center">{stat.count}</td>
                          <td className="px-4 py-2 text-right">₹{stat.avgSalary}</td>
                          <td className="px-4 py-2 text-right">{stat.avgPerformance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {tab === "analytics" && showAnalytics && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span>📈</span> Analytics</h2>
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
                  <BarChart data={salaryGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#6366f1" name="Salary" />
                  </BarChart>
                </ResponsiveContainer>
                {salaryGrowthData.every(item => item.total === 0) && (
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

          {/* Performance Tab */}
          {tab === "performance" && showPerformance && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-yellow-700 flex items-center gap-2"><span>🌟</span> Performance</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-yellow-100 rounded-xl p-4 flex-1 text-center shadow">
                  <div className="text-lg font-bold text-yellow-700">{overallPerformance.toFixed(2)} ⭐</div>
                  <div className="text-gray-600">Avg. Performance</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center shadow">
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

          {/* Leave Tab */}
          {tab === "leave" && showLeave && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2"><span>🗓️</span> Leave</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-pink-100 rounded-xl p-4 flex-1 text-center shadow">
                  <div className="text-lg font-bold text-pink-700">{overallLeaves}</div>
                  <div className="text-gray-600">Total Leaves</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-4 flex-1 text-center shadow">
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

          {/* Attendance Tab */}
          {tab === "attendance" && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2"><span>🕒</span> Attendance</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendancePercent" stroke="#34d399" name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-purple-700">Top Punctual Employees</h3>
                <div className="flex flex-wrap gap-4">
                  {punctualEmployees.map(emp => (
                    <div key={emp._id} className="bg-green-100 rounded-lg px-4 py-2 flex items-center gap-2 shadow">
                      <span className="text-lg font-bold text-green-700">{emp.name}</span>
                      <span className="text-gray-600">({emp.department})</span>
                      <span className="text-green-700 font-bold">{emp.avgAttendance?.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Turnover Tab */}
          {tab === "turnover" && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-fuchsia-700 flex items-center gap-2"><span>🔄</span> Turnover</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={turnoverData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="joiners" fill="#34d399" name="Joiners" />
                  <Bar dataKey="exits" fill="#f87171" name="Exits" />
                </BarChart>
              </ResponsiveContainer>
              <table className="min-w-full divide-y divide-purple-100 mt-6">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Month</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Joiners</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Exits</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {turnoverData.map(row => (
                    <tr key={row.month}>
                      <td className="px-4 py-2">{row.month}</td>
                      <td className="px-4 py-2 text-center">{row.joiners}</td>
                      <td className="px-4 py-2 text-center">{row.exits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Insights Tab */}
          {tab === "insights" && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span>💡</span> Insights</h2>
              <ul className="list-disc pl-8 text-lg text-gray-700 space-y-2">
                {insights.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Employee Report Tab */}
          {tab === "employee" && (
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span>👤</span> Employee Report</h2>
              <div className="mb-4">
                <select
                  className="border border-purple-300 rounded px-4 py-2 bg-white focus:outline-none"
                  value={selectedEmp?._id || ""}
                  onChange={e => {
                    const emp = employees.find(emp => emp._id === e.target.value);
                    setSelectedEmp(emp || null);
                  }}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>
              {selectedEmp ? (
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-white rounded-xl shadow-lg p-8 border border-purple-100">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-purple-700 mb-2">{selectedEmp.name}</div>
                      <div className="text-lg text-gray-600 mb-2">{selectedEmp.department}</div>
                      <div className="mb-2"><span className="font-semibold">Position:</span> {selectedEmp.position || "N/A"}</div>
                      <div className="mb-2"><span className="font-semibold">Salary:</span> ₹{selectedEmp.salary}</div>
                      <div className="mb-2"><span className="font-semibold">Performance:</span> {selectedEmp.performance} ⭐</div>
                      <div className="mb-2"><span className="font-semibold">Leaves:</span> {selectedEmp.leaves}</div>
                      <div className="mb-2"><span className="font-semibold">Join Date:</span> {selectedEmp.joinDate ? getMonthYear(selectedEmp.joinDate) : "N/A"}</div>
                      <div className="mb-2"><span className="font-semibold">Exit Date:</span> {selectedEmp.exitDate ? getMonthYear(selectedEmp.exitDate) : "N/A"}</div>
                    </div>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={Object.entries(selectedEmp.attendance || {}).map(([month, days]) => ({ month, days }))}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="days" fill="#34d399" name="Present Days" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center">Select an employee to view report.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;