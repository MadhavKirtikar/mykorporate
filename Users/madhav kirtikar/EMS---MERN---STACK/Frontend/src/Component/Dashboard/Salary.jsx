 import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
//import axios from "axios";

const USE_DUMMY = true; // Set to false when backend is ready
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

const DUMMY_SALARIES = [
  { id: 1, name: "Amit", department: "HR", month: "June", amount: 25000, status: "Paid" },
  { id: 2, name: "Priya", department: "IT", month: "May", amount: 30000, status: "Paid" },
  { id: 3, name: "Ravi", department: "Finance", month: "April", amount: 22000, status: "Pending" },
];

const DUMMY_EMPLOYEES = [
  { id: 1, name: "Amit", department: "HR", salary: 25000 },
  { id: 2, name: "Priya", department: "IT", salary: 30000 },
  { id: 3, name: "Ravi", department: "Finance", salary: 22000 },
];

const DUMMY_DEPARTMENTS = [
  { id: 1, name: "HR" },
  { id: 2, name: "IT" },
  { id: 3, name: "Finance" },
];

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", month: "", amount: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteSalary, setDeleteSalary] = useState(null);
  const empSelectRef = useRef();
  const receiptRef = useRef();

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
  if (USE_DUMMY) {
    setSalaries(DUMMY_SALARIES);
  setEmployees(DUMMY_EMPLOYEES);
  setDepartments(DUMMY_DEPARTMENTS);
    return;
  }
  const fetchData = async () => {
    try {
      const [salRes, empRes, deptRes] = await Promise.all([
        axios.get("/api/salaries"),
        axios.get("/api/employees"),
        axios.get("/api/departments"),
      ]);
      setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
    } catch (error) {
      setSalaries([]);
      setEmployees([]);
      setDepartments([]);
    }
  } 
}, []);

  const filteredSalaries = Array.isArray(salaries)
    ? salaries.filter(
        (salary) =>
          salary.name?.toLowerCase().includes(search.toLowerCase()) ||
          salary.department?.toLowerCase().includes(search.toLowerCase()) ||
          salary.month?.toLowerCase().includes(search.toLowerCase())
      )
    : [];
    

  const totalPaid = Array.isArray(salaries)
    ? salaries
        .filter((s) => s.status === "Paid")
        .reduce((sum, s) => sum + Number(s.amount), 0)
    : 0;

  const totalPending = Array.isArray(salaries)
    ? salaries
        .filter((s) => s.status === "Pending")
        .reduce((sum, s) => sum + Number(s.amount), 0)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name || !form.department || !form.month || !form.amount) {
      setError("All fields are required.");
      return;
    }
    const newSalary = {
      id: Date.now(),
      name: form.name,
      department: form.department,
      month: form.month,
      amount: form.amount,
      status: "Pending",
    };
    setSalaries([...salaries, newSalary]);
    setForm({ name: "", department: "", month: "", amount: "" });
    setMessage("Salary added successfully.");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmpKeyDown = () => {};

  const handleDownloadReceipt = (salary) => {
    console.log("salary object:", salary);
    
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

  const handleMarkAsPaid = (salary) => {
    setSalaries(
      salaries.map((s) =>
        s.id === salary.id ? { ...s, status: "Paid" } : s
      )
    );
    setMessage("Marked as paid.");
  };

  const handleDelete = (id) => {
    setDeleteSalary(id);
  };

  const confirmDelete = () => {
    setSalaries(salaries.filter((s) => s.id !== deleteSalary));
    setMessage("Salary record deleted.");
    setDeleteSalary(null);
  };

  const cancelDelete = () => setDeleteSalary(null);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f3f4f6] via-[#e0e7ff] to-[#fdf2f8]">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-10 ml-0 md:ml-64">
        
 
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-pink-400 drop-shadow-lg text-center w-full">
              Salary Management
            </h1>
          </div>
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
 
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-4">
              <div className="flex-1 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl font-semibold shadow-sm text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Total Paid</div>
                <div className="text-2xl font-bold">₹{totalPaid}</div>
              </div>
              <div className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl font-semibold shadow-sm text-center">
                <div className="text-xs uppercase tracking-wider mb-1">Total Pending</div>
                <div className="text-2xl font-bold">₹{totalPending}</div>
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
                  className="pl-12 pr-4 py-2 rounded-full border border-purple-200 focus:border-purple-500 outline-none text-base w-full shadow"
                />
              </div>
            </div>
          </div>
          
          <form
            className="mb-10 bg-white/90 rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-end border border-purple-100"
            onSubmit={handleAdd}
          >
            <div className="md:col-span-2">
              <input
                list="employee-list"
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
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
                onKeyDown={handleEmpKeyDown}
              />
              <datalist id="employee-list">
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name} />
                ))}
              </datalist>
            </div>
            <div>
              <select
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
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
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
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
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
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
                Add Salary
              </button>
            </div>
          </form>
          <div className="overflow-x-auto bg-white/95 rounded-2xl shadow-lg border border-purple-100">
            {filteredSalaries.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xl font-medium tracking-wide">
                <span className="inline-block animate-bounce text-4xl mb-2">💸</span>
                <br />
                No employee salary records found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-purple-100">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {filteredSalaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700">{salary.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{salary.department}</td>
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
            )}
          </div>
          <div style={{ display: "none" }}>
            <div ref={receiptRef}></div>
          </div>
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