 import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const USE_DUMMY = true;

const DUMMY_EMPLOYEES = [
  { id: 1, name: "Amit", department: "HR", salary: 50000 },
  { id: 2, name: "Priya", department: "IT", salary: 60000 },
  { id: 3, name: "Ravi", department: "Finance", salary: 45000 },
];

const DUMMY_DEPARTMENTS = [
  { id: 1, name: "HR" },
  { id: 2, name: "IT" },
  { id: 3, name: "Finance" },
];

const DUMMY_SALARIES = [
  { id: 1, name: "Amit", department: "HR", month: "June", amount: 50000, status: "Paid" },
  { id: 2, name: "Priya", department: "IT", month: "June", amount: 60000, status: "Pending" },
  { id: 3, name: "Ravi", department: "Finance", month: "May", amount: 45000, status: "Paid" },
  { id: 4, name: "Amit", department: "HR", month: "May", amount: 50000, status: "Paid" },
  { id: 5, name: "Priya", department: "IT", month: "May", amount: 60000, status: "Paid" },
];

const monthColors = {
  January: "bg-blue-100 text-blue-700",
  February: "bg-pink-100 text-pink-700",
  March: "bg-green-100 text-green-700",
  April: "bg-yellow-100 text-yellow-700",
  May: "bg-purple-100 text-purple-700",
  June: "bg-red-100 text-red-700",
  July: "bg-indigo-100 text-indigo-700",
  August: "bg-orange-100 text-orange-700",
  September: "bg-teal-100 text-teal-700",
  October: "bg-gray-100 text-gray-700",
  November: "bg-fuchsia-100 text-fuchsia-700",
  December: "bg-cyan-100 text-cyan-700",
};

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", month: "", amount: "" });
  const [bulkMonth, setBulkMonth] = useState(""); // Only month for all employees
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteSalary, setDeleteSalary] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const empSelectRef = useRef();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchData = async () => {
      if (USE_DUMMY) {
        setSalaries(DUMMY_SALARIES);
        setEmployees(DUMMY_EMPLOYEES);
        setDepartments(DUMMY_DEPARTMENTS);
        return;
      }
      try {
        const [salRes, empRes, deptRes] = await Promise.all([
          axios.get("/api/salaries"),
          axios.get("/api/employees"),
          axios.get("/api/departments"),
        ]);
        setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
        setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      } catch {
        setSalaries(DUMMY_SALARIES);
        setEmployees(DUMMY_EMPLOYEES);
        setDepartments(DUMMY_DEPARTMENTS);
      }
    };
    fetchData();
  }, []);

  const filteredSalaries = Array.isArray(salaries)
    ? salaries.filter(
        (salary) =>
          (statusFilter === "All" || salary.status === statusFilter) &&
          (salary.name?.toLowerCase().includes(search.toLowerCase()) ||
            salary.department?.toLowerCase().includes(search.toLowerCase()) ||
            salary.month?.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const totalPaid = Array.isArray(salaries)
    ? salaries.filter((s) => s.status === "Paid").reduce((sum, s) => sum + Number(s.amount), 0)
    : 0;

  const totalPending = Array.isArray(salaries)
    ? salaries.filter((s) => s.status === "Pending").reduce((sum, s) => sum + Number(s.amount), 0)
    : 0;

  // Add salary for single employee
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name || !form.department || !form.month || !form.amount) {
      setError("All fields are required.");
      return;
    }
    if (USE_DUMMY) {
      const newSalary = {
        id: Date.now(),
        name: form.name,
        department: form.department,
        month: form.month,
        amount: form.amount,
        status: "Pending",
      };
      setSalaries([...salaries, newSalary]);
      setMessage("Salary added successfully.");
      setForm({ name: "", department: "", month: "", amount: "" });
      return;
    }
    try {
      await axios.post("/api/salaries", {
        name: form.name,
        department: form.department,
        month: form.month,
        amount: form.amount,
        status: "Pending",
      });
      setMessage("Salary added successfully.");
      setForm({ name: "", department: "", month: "", amount: "" });
      const salRes = await axios.get("/api/salaries");
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
    } catch {
      setError("Failed to add salary.");
    }
  };

  // Add salary for all employees (salary auto from employee)
  const handleAddAll = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!bulkMonth) {
      setError("Select month!");
      return;
    }
    if (USE_DUMMY) {
      const newSalaries = employees.map((emp) => ({
        id: Date.now() + Math.random(),
        name: emp.name,
        department: emp.department,
        month: bulkMonth,
        amount: emp.salary,
        status: "Pending",
      }));
      setSalaries([...salaries, ...newSalaries]);
      setMessage("Salary added for all employees!");
      setBulkMonth("");
      return;
    }
    try {
      await axios.post("/api/salaries/bulk", {
        month: bulkMonth,
        // Backend should use employee's salary
      });
      setMessage("Salary added for all employees!");
      setBulkMonth("");
      const salRes = await axios.get("/api/salaries");
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
    } catch {
      setError("Failed to add salary for all employees.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownloadReceipt = (salary) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#6D28D9");
    doc.text("Salary Receipt", 14, 18);
    doc.setFontSize(12);
    doc.setTextColor("#374151");
    doc.text(`Employee: ${salary.name}`, 14, 30);
    doc.text(`Department: ${salary.department}`, 14, 38);
    doc.text(`Month: ${salary.month}`, 14, 46);
    doc.text(`Amount: ₹${salary.amount}`, 14, 54);
    doc.text(`Status: ${salary.status}`, 14, 62);

    autoTable(doc, {
      startY: 70,
      head: [["Field", "Value"]],
      body: [
        ["Employee", salary.name],
        ["Department", salary.department],
        ["Month", salary.month],
        ["Amount", `₹${salary.amount}`],
        ["Status", salary.status],
      ],
      theme: "striped",
      headStyles: { fillColor: [167, 139, 250], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 11, cellPadding: 3 },
      alternateRowStyles: { fillColor: [243, 232, 255] }
    });

    doc.save(`Salary-Receipt-${salary.name}-${salary.month}.pdf`);
  };

  const handleMarkAsPaid = async (salary) => {
    if (USE_DUMMY) {
      setSalaries(
        salaries.map((s) =>
          (s.id || s._id) === (salary.id || salary._id)
            ? { ...s, status: "Paid" }
            : s
        )
      );
      setMessage("Marked as paid.");
      return;
    }
    try {
      await axios.patch(`/api/salaries/${salary._id || salary.id}`, { status: "Paid" });
      setMessage("Marked as paid.");
      const salRes = await axios.get("/api/salaries");
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
    } catch {
      setError("Failed to mark as paid.");
    }
  };

  const handleDelete = (id) => {
    setDeleteSalary(id);
  };

  const confirmDelete = async () => {
    if (USE_DUMMY) {
      setSalaries(salaries.filter((s) => (s.id || s._id) !== deleteSalary));
      setMessage("Salary record deleted.");
      setDeleteSalary(null);
      return;
    }
    try {
      await axios.delete(`/api/salaries/${deleteSalary}`);
      setMessage("Salary record deleted.");
      setDeleteSalary(null);
      const salRes = await axios.get("/api/salaries");
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
    } catch {
      setError("Failed to delete salary record.");
      setDeleteSalary(null);
    }
  };

  const cancelDelete = () => setDeleteSalary(null);

  // Bulk mark as paid
  const handleBulkMarkAsPaid = async () => {
    if (!bulkMonth) {
      setError("Select a month first!");
      return;
    }
    if (USE_DUMMY) {
      setSalaries(
        salaries.map((s) =>
          s.month === bulkMonth ? { ...s, status: "Paid" } : s
        )
      );
      setMessage(`All salaries for ${bulkMonth} marked as Paid.`);
      return;
    }
    try {
      await axios.patch("/api/salaries/mark-all-paid", { month: bulkMonth });
      setMessage(`All salaries for ${bulkMonth} marked as Paid.`);
      const salRes = await axios.get("/api/salaries");
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
    } catch {
      setError("Failed to mark all as paid.");
    }
  };

  // Bulk download receipts as PDF
  const handleBulkDownloadReceipts = async () => {
    if (!bulkMonth) {
      setError("Select a month first!");
      return;
    }
    const monthSalaries = salaries.filter((s) => s.month === bulkMonth);
    if (monthSalaries.length === 0) {
      setError("No salaries found for this month.");
      return;
    }
    const doc = new jsPDF();
    monthSalaries.forEach((salary, idx) => {
      if (idx !== 0) doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor("#6D28D9");
      doc.text("Salary Receipt", 14, 18);
      doc.setFontSize(12);
      doc.setTextColor("#374151");
      doc.text(`Employee: ${salary.name}`, 14, 30);
      doc.text(`Department: ${salary.department}`, 14, 38);
      doc.text(`Month: ${salary.month}`, 14, 46);
      doc.text(`Amount: ₹${salary.amount}`, 14, 54);
      doc.text(`Status: ${salary.status}`, 14, 62);

      autoTable(doc, {
        startY: 70,
        head: [["Field", "Value"]],
        body: [
          ["Employee", salary.name],
          ["Department", salary.department],
          ["Month", salary.month],
          ["Amount", `₹${salary.amount}`],
          ["Status", salary.status],
        ],
        theme: "striped",
        headStyles: { fillColor: [167, 139, 250], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 3 },
        alternateRowStyles: { fillColor: [243, 232, 255] }
      });
    });
    doc.save(`Salary-Receipts-${bulkMonth}.pdf`);
  };

  // Group salaries by employee (filtered)
  const groupedSalaries = {};
  filteredSalaries.forEach((salary) => {
    if (!groupedSalaries[salary.name]) groupedSalaries[salary.name] = [];
    groupedSalaries[salary.name].push(salary);
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3f4f6] via-[#e0e7ff] to-[#fdf2f8]">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-10 ml-0 md:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-4xl font-extrabold text-center tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Salary Management
            </span>
            </h1>
           
          </div>

          {/* Stats */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 flex gap-4">
              <div className="flex-1 bg-gradient-to-br from-green-100 via-green-50 to-white border border-green-200 text-green-700 px-6 py-5 rounded-2xl font-semibold shadow text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Total Paid</div>
                <div className="text-3xl font-extrabold flex items-center justify-center gap-2">
                  <span>₹{totalPaid}</span>
                  <span className="text-green-400 text-2xl">✔️</span>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-yellow-100 via-yellow-50 to-white border border-yellow-200 text-yellow-700 px-6 py-5 rounded-2xl font-semibold shadow text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Total Pending</div>
                <div className="text-3xl font-extrabold flex items-center justify-center gap-2">
                  <span>₹{totalPending}</span>
                  <span className="text-yellow-400 text-2xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <div className="relative w-full md:w-72">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-400 pointer-events-none">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="#a78bfa" strokeWidth="2"/>
                    <path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search salary..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-2 rounded-full border border-purple-300 focus:border-purple-500 outline-none text-base w-full shadow bg-white"
                  style={{ boxShadow: "0 2px 8px 0 #ede9fe" }}
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap gap-2 mb-8 items-center justify-between">
            <div className="flex gap-2">
              <select
                className="border border-purple-300 rounded-l px-4 py-2 bg-white focus:outline-none"
                value={bulkMonth}
                onChange={e => setBulkMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {Object.keys(monthColors).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <button
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-r font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
                onClick={handleBulkMarkAsPaid}
              >
                Mark All as Paid
              </button>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
                onClick={handleBulkDownloadReceipts}
              >
                Download All Receipts (PDF)
              </button>
            </div>
            <select
              className="border border-purple-300 rounded px-4 py-2 bg-white focus:outline-none font-semibold"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                background: "linear-gradient(90deg, #ede9fe 0%, #fdf2f8 100%)",
                color: "#7c3aed",
                borderWidth: "2px"
              }}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Add Salary Form */}
          <form
            className="mb-6 bg-gradient-to-br from-purple-50 via-blue-50 to-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-end border border-purple-100"
            onSubmit={handleAdd}
          >
            <div className="md:col-span-2">
              <input
                list="employee-list"
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition bg-white"
                name="name"
                value={form.name}
                onChange={(e) => {
                  const emp = employees.find(emp => emp.name === e.target.value);
                  setForm({
                    ...form,
                    name: e.target.value,
                    department: emp ? emp.department : "",
                    amount: emp ? emp.salary : "",
                  });
                }}
                ref={empSelectRef}
                placeholder="Type or select employee name"
              />
              <datalist id="employee-list">
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name} />
                ))}
              </datalist>
            </div>
            <div>
              <select
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition bg-white"
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition bg-white"
                name="month"
                value={form.month}
                onChange={handleChange}
              >
                <option value="">Select Month</option>
                {Object.keys(monthColors).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition bg-white"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                type="number"
                min="0"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-500 transition"
              >
                + Add Salary
              </button>
            </div>
          </form>

          {/* Add Salary for All Employees (only month, salary auto) */}
          <form
            className="mb-10 bg-gradient-to-br from-pink-50 via-blue-50 to-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end border border-pink-100"
            onSubmit={handleAddAll}
          >
            <div>
              <select
                className="border-2 border-pink-200 focus:border-pink-500 p-3 rounded-lg w-full transition bg-white"
                name="bulkMonth"
                value={bulkMonth}
                onChange={e => setBulkMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {Object.keys(monthColors).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-blue-500 transition"
              >
                + Add Salary For All Employees (Auto)
              </button>
            </div>
          </form>

          {/* Alerts */}
          {message && (
            <div className="flex justify-center mb-4">
              <div className="animate-fade-in-out px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-lg flex items-center gap-2 border-2 border-green-300">
                <svg width="24" height="24" fill="none" className="mr-2">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {message}
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center mb-4">
              <div className="animate-fade-in-out px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold text-lg flex items-center gap-2 border-2 border-red-300">
                <svg width="24" height="24" fill="none" className="mr-2">
                  <circle cx="12" cy="12" r="10" fill="#ef4444" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Grouped salary sections */}
          {Object.keys(groupedSalaries).length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-xl font-medium tracking-wide bg-white/95 rounded-2xl shadow-lg border border-purple-100">
              <span className="inline-block animate-bounce text-4xl mb-2">💸</span>
              <br />
              No employee salary records found.
            </div>
          ) : (
            <div className="space-y-10">
              {Object.keys(groupedSalaries).map((empName) => (
                <div
                  key={empName}
                  className="bg-white/95 rounded-2xl shadow-lg border border-purple-100 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center text-3xl font-bold text-purple-700 shadow">
                      {empName[0]}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-700">{empName}</div>
                      <div className="text-sm text-gray-500">
                        {groupedSalaries[empName][0]?.department}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-100">
                      <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-purple-50">
                        {groupedSalaries[empName].map((salary) => (
                          <tr key={salary.id} className="hover:bg-purple-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full font-semibold shadow text-xs ${monthColors[salary.month] || "bg-gray-100 text-gray-700"}`}>
                                {salary.month}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700">₹{salary.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${salary.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {salary.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex flex-col md:flex-row gap-2">
                              <button
                                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-1 rounded-lg shadow hover:from-blue-500 hover:to-blue-700 transition text-sm"
                                onClick={() => handleDownloadReceipt(salary)}
                              >
                                Download Receipt
                              </button>
                              {salary.status === "Pending" && (
                                <button
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition text-sm"
                                  onClick={() => handleMarkAsPaid(salary)}
                                >
                                  Mark as Paid
                                </button>
                              )}
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1 rounded-lg shadow hover:from-red-600 hover:to-red-800 transition text-sm"
                                onClick={() => handleDelete(salary.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Modal */}
          {deleteSalary && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center border border-red-200">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Are you sure?
                </h3>
                <p className="mb-6 text-gray-600">
                  Do you really want to delete this salary record? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Salary;