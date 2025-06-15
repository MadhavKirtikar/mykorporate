 import React, { useState, useEffect } from "react";
import axios from "axios";

const FILTERS = [
  { label: "All", color: "bg-purple-100 text-purple-700" },
  { label: "Approved", color: "bg-green-100 text-green-700" },
  { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { label: "Rejected", color: "bg-red-100 text-red-700" },
];

const Leaves = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ date: "", endDate: "", type: "", reason: "" });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    // Fetch leaves from backend
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/leaves", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaves(Array.isArray(res.data) ? res.data : []);
      } catch {
        setLeaves([]);
      }
    };
    fetchLeaves();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your leaves.
      </div>
    );
  }

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter((l) => l.status === filter);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.date && form.type) {
      if (!form.endDate) form.endDate = form.date;
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "/api/leaves",
          { ...form, status: "Pending" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const res = await axios.get("/api/leaves", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaves(Array.isArray(res.data) ? res.data : []);
        setForm({ date: "", endDate: "", type: "", reason: "" });
        setShowForm(false);
        setMessage("Leave request sent to admin!");
        setTimeout(() => setMessage(""), 2500);
      } catch {
        setLeaves([]);
        setMessage("Failed to send leave request.");
      }
    }
  };

  const getDays = (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
  };

  const approvedCount = leaves.filter(l => l.status === "Approved").length;
  const pendingCount = leaves.filter(l => l.status === "Pending").length;
  const rejectedCount = leaves.filter(l => l.status === "Rejected").length;

  return (
    <div className="max-w-3xl mx-auto mt-4 pb-8">
      {/* Title same style as Settings/Calendar/Notifications */}
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Leaves
        </span>
      </h2>
      {/* FILTERS */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button
            key={f.label}
            className={`px-5 py-1.5 rounded-full font-bold border-2 transition-all duration-200 shadow-sm
              ${filter === f.label
                ? `${f.color} border-purple-600 scale-105`
                : "bg-white border-purple-200 hover:bg-purple-50"
              }`}
            onClick={() => setFilter(f.label)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
            Approved: {approvedCount}
          </span>
          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
            Pending: {pendingCount}
          </span>
          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
            Rejected: {rejectedCount}
          </span>
          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
            Total: {leaves.length}
          </span>
        </div>
        <button
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:from-purple-700 hover:to-blue-600 transition shadow self-center md:self-auto"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "Apply Leave"}
        </button>
      </div>
      {/* MESSAGE */}
      {message && (
        <div className="mb-4 text-center font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl py-2 shadow animate-pulse">
          {message}
        </div>
      )}
      {/* FORM */}
      {showForm && (
        <form onSubmit={handleApply} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-gradient-to-r from-purple-50 via-blue-50 to-white rounded-2xl p-6 border border-purple-100 shadow">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-purple-700 mb-1">From</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 calendar-input"
              required
              min={new Date().toISOString().slice(0, 10)}
              style={{ background: "linear-gradient(90deg, #ede9fe 0%, #e0e7ff 100%)" }}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-purple-700 mb-1">To</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 calendar-input"
              min={form.date || new Date().toISOString().slice(0, 10)}
              style={{ background: "linear-gradient(90deg, #ede9fe 0%, #e0e7ff 100%)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            >
              <option value="">Select</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-semibold text-purple-700 mb-1">Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border-2 border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Optional"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-xl font-bold hover:from-green-600 hover:to-green-800 transition md:col-span-5 shadow"
          >
            Apply
          </button>
        </form>
      )}
      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl shadow border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <table className="min-w-full rounded-xl">
          <thead>
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tl-2xl">
                From
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                To
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                Days
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                Type
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                Reason
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tr-2xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredLeaves) && filteredLeaves.map((leave, idx) => (
              <tr key={idx} className={`border-b last:border-b-0 transition hover:bg-purple-50 ${idx % 2 === 0 ? "bg-white" : "bg-purple-50/60"}`}>
                <td className="py-3 px-6 font-medium">{leave.date}</td>
                <td className="py-3 px-6 font-medium">{leave.endDate || leave.date}</td>
                <td className="py-3 px-6 font-medium">
                  {getDays(leave.date, leave.endDate || leave.date)}
                </td>
                <td className="py-3 px-6">{leave.type}</td>
                <td className="py-3 px-6">{leave.reason}</td>
                <td className="py-3 px-6">
                  {leave.status === "Approved" && (
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Approved</span>
                  )}
                  {leave.status === "Pending" && (
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">Pending</span>
                  )}
                  {leave.status === "Rejected" && (
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
            {(!Array.isArray(filteredLeaves) || filteredLeaves.length === 0) && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 text-lg font-medium">
                  <span className="inline-block animate-bounce text-4xl mb-2">🌴</span>
                  <br />
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-xs text-gray-400 mt-6 text-center pb-4">
           </div>
      </div>
    </div>
  );
};

export default Leaves;