 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
//import axios from "axios";

const USE_DUMMY = true; // Backend aane par false kar dena

const DUMMY_DEPARTMENTS = [
  { name: "HR" },
  { name: "IT" },
  { name: "Finance" },
];

const DUMMY_LEAVES = [
  {
    _id: 1,
    name: "Amit",
    department: "HR",
    from: "2025-06-10",
    to: "2025-06-12",
    reason: "Personal",
    status: "Pending",
  },
  {
    _id: 2,
    name: "Priya",
    department: "IT",
    from: "2025-06-08",
    to: "2025-06-09",
    reason: "Medical",
    status: "Approved",
  },
];

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    department: "",
    from: "",
    to: "",
    reason: "",
    status: "Pending",
  });
  const [show, setShow] = useState(false);
  const [deleteLeave, setDeleteLeave] = useState(null);
  const [addError, setAddError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setShow(true);

    if (USE_DUMMY) {
      setLeaves(DUMMY_LEAVES);
      setDepartments(DUMMY_DEPARTMENTS);
      return;
    }

    // Backend API calls
    const fetchAll = async () => {
      try {
        const [leaveRes, deptRes] = await Promise.all([
          axios.get("/api/leaves"),
          axios.get("/api/departments"),
        ]);
        setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : []);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      } catch {
        setLeaves([]);
        setDepartments([]);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAddError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department || !form.from || !form.to || !form.reason) {
      setAddError("All fields are required.");
      return;
    }
    if (USE_DUMMY) {
      const newLeave = {
        ...form,
        _id: Date.now(),
      };
      setLeaves([newLeave, ...leaves]);
      setSuccessMsg("Leave applied successfully!");
      setForm({
        name: "",
        department: "",
        from: "",
        to: "",
        reason: "",
        status: "Pending",
      });
      return;
    }
    // Backend add
    // try {
    //   await axios.post("/api/leaves", form);
    //   setSuccessMsg("Leave applied successfully!");
    // } catch {
    //   setAddError("Failed to apply leave.");
    // }
  };

  const handleStatus = (id, status) => {
    if (USE_DUMMY) {
      setLeaves(
        leaves.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        )
      );
      setSuccessMsg(`Leave ${status}!`);
      return;
    }
    // Backend update
    // await axios.patch(`/api/leaves/${id}`, { status });
    // fetch leaves again or update state
  };

  const handleDelete = (id) => {
    setDeleteLeave(id);
  };

  const confirmDelete = () => {
    if (USE_DUMMY) {
      setLeaves(leaves.filter((leave) => leave._id !== deleteLeave));
      setDeleteLeave(null);
      setSuccessMsg("Leave deleted!");
      return;
    }
    // Backend delete
    // await axios.delete(`/api/leaves/${deleteLeave}`);
    // fetch leaves again or update state
    setDeleteLeave(null);
  };

  const cancelDelete = () => {
    setDeleteLeave(null);
  };

  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");

  const leavesByEmployee = leaves.reduce((acc, leave) => {
    const empName = leave.name || "Unknown";
    if (!acc[empName]) acc[empName] = [];
    acc[empName].push(leave);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return (
      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow border border-blue-200">
        {date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
      <main
        className={`
          flex-1 p-4 md:p-10 ml-0 md:ml-64
          transform transition-transform duration-500
          ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
        style={{ willChange: "transform, opacity" }}
      >
         <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-purple-700 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-500 via-red-500 to-blue-400 bg-clip-text text-transparent">
              Leave Management
            </span>
          </h1>
          {successMsg && (
            <div className="flex justify-center mb-4">
              <div className="animate-fade-in-out px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-lg flex items-center gap-2 border-2 border-green-300">
                <svg width="24" height="24" fill="none" className="mr-2">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {successMsg}
              </div>
            </div>
          )}
          <form
            className="mb-4 bg-white/80 rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-6 gap-6 items-end border border-purple-100"
            onSubmit={handleAdd}
          >
            <input
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Employee Name"
            />
            <select
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <div className="relative w-full">
              <input
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition pl-12 bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="From"
                type="date"
                style={{
                  color: form.from ? "#1e293b" : "#a0aec0",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(90deg, #f3e8ff 0%, #e0e7ff 100%)"
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-blue-400 pointer-events-none">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="3" stroke="#60a5fa" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="14" r="2" fill="#60a5fa"/>
                </svg>
              </span>
            </div>
            <div className="relative w-full">
              <input
                className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition pl-12 bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="To"
                type="date"
                style={{
                  color: form.to ? "#1e293b" : "#a0aec0",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(90deg, #f3e8ff 0%, #e0e7ff 100%)"
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-blue-400 pointer-events-none">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="3" stroke="#60a5fa" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="14" r="2" fill="#60a5fa"/>
                </svg>
              </span>
            </div>
            <input
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Reason"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-500 transition"
            >
              Apply Leave
            </button>
          </form>
          {addError && <div className="text-red-500 mb-4">{addError}</div>}
          <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Pending Leave Requests</h2>
          <div className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl border border-purple-100 p-4 mb-8">
            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-lg">No pending requests.</div>
            ) : (
              <table className="min-w-full divide-y divide-purple-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">Reason</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td className="px-4 py-2">{leave.name}</td>
                      <td className="px-4 py-2">{leave.department}</td>
                      <td className="px-4 py-2">{formatDate(leave.from)}</td>
                      <td className="px-4 py-2">{formatDate(leave.to)}</td>
                      <td className="px-4 py-2">{leave.reason}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleStatus(leave._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleStatus(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(leave._id)}
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
          <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Employee Leave History</h2>
          <div className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl border border-purple-100 p-4">
            {Object.keys(leavesByEmployee).length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xl font-medium tracking-wide">
                <span className="inline-block animate-bounce text-4xl mb-2">📝</span>
                <br />
                No leave records found.
              </div>
            ) : (
              Object.entries(leavesByEmployee).map(([empName, empLeaves]) => {
                // Only show Approved/Rejected in history
                const historyLeaves = empLeaves.filter(l => l.status !== "Pending");
                if (historyLeaves.length === 0) return null;
                return (
                  <div key={empName} className="mb-8">
                    <h3 className="text-lg font-bold text-purple-600 mb-2">{empName}</h3>
                    <table className="min-w-full divide-y divide-purple-100 table-fixed">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Department</th>
                          <th className="px-4 py-2">From</th>
                          <th className="px-4 py-2">To</th>
                          <th className="px-4 py-2">Reason</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyLeaves.map((leave) => (
                          <tr key={leave._id}>
                            <td className="px-4 py-2">{leave.department}</td>
                            <td className="px-4 py-2">{formatDate(leave.from)}</td>
                            <td className="px-4 py-2">{formatDate(leave.to)}</td>
                            <td className="px-4 py-2">{leave.reason}</td>
                            <td className="px-4 py-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                                leave.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : leave.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {leave.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={() => handleDelete(leave._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            )}
          </div>
          {deleteLeave && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Are you sure?
                </h3>
                <p className="mb-6">
                  Do you really want to delete this leave? This action cannot be undone.
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

export default Leave;