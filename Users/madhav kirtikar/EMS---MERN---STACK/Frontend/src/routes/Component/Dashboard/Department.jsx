 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_DEPARTMENTS = [
  { id: 1, name: "HR", description: "Human Resources" },
  { id: 2, name: "IT", description: "Information Technology" },
  { id: 3, name: "Finance", description: "Finance Department" },
];

const DUMMY_EMPLOYEES = [
  { id: 1, name: "Amit", department: "HR" },
  { id: 2, name: "Priya", department: "IT" },
  { id: 3, name: "Ravi", department: "Finance" },
  { id: 4, name: "Sonal", department: "HR" },
];

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editDept, setEditDept] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteDept, setDeleteDept] = useState(null);
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Fetch departments and employees from backend or dummy
  const fetchAll = async () => {
    if (USE_DUMMY) {
      setDepartments(DUMMY_DEPARTMENTS);
      setEmployees(DUMMY_EMPLOYEES);
      return;
    }
    try {
      const [deptRes, empRes] = await Promise.all([
        axios.get("/api/departments"),
        axios.get("/api/employees"),
      ]);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
    } catch {
      setDepartments([]);
      setEmployees([]);
    }
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
    fetchAll();
    // eslint-disable-next-line
  }, []);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  // ADD department (dummy/backend)
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name || !form.description) {
      setError("All fields are required.");
      return;
    }
    if (
      departments.some(
        (d) =>
          d.name.trim().toLowerCase() === form.name.trim().toLowerCase()
      )
    ) {
      setError("Department already exists.");
      return;
    }
    if (USE_DUMMY) {
      const newDept = {
        id: Date.now(),
        name: form.name,
        description: form.description,
      };
      setDepartments([...departments, newDept]);
      setForm({ name: "", description: "" });
      setMessage("Department added successfully!");
      return;
    }
    try {
      await axios.post("/api/departments", form);
      setForm({ name: "", description: "" });
      setMessage("Department added successfully!");
      fetchAll();
    } catch {
      setError("Failed to add department.");
    }
  };

  // EDIT department (dummy/backend)
  const handleEditSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name || !form.description) {
      setError("All fields are required.");
      return;
    }
    if (
      departments.some(
        (d) =>
          d.id !== editDept.id &&
          d.name.trim().toLowerCase() === form.name.trim().toLowerCase()
      )
    ) {
      setError("Department already exists.");
      return;
    }
    if (USE_DUMMY) {
      setDepartments(
        departments.map((d) =>
          d.id === editDept.id
            ? { ...d, name: form.name, description: form.description }
            : d
        )
      );
      setEditDept(null);
      setForm({ name: "", description: "" });
      setMessage("Department updated successfully!");
      return;
    }
    try {
      await axios.put(`/api/departments/${editDept.id}`, form);
      setEditDept(null);
      setForm({ name: "", description: "" });
      setMessage("Department updated successfully!");
      fetchAll();
    } catch {
      setError("Failed to update department.");
    }
  };

  const handleEditClick = (dept) => {
    setEditDept(dept);
    setForm({ name: dept.name, description: dept.description });
    setError("");
    setMessage("");
  };

  const handleEditCancel = () => {
    setEditDept(null);
    setForm({ name: "", description: "" });
    setError("");
    setMessage("");
  };

  // DELETE department (dummy/backend)
  const handleDeleteConfirm = async () => {
    if (USE_DUMMY) {
      setDepartments(departments.filter((d) => d.id !== deleteDept.id));
      setDeleteDept(null);
      setMessage("Department deleted.");
      setError("");
      if (editDept && editDept.id === deleteDept.id) {
        setEditDept(null);
        setForm({ name: "", description: "" });
      }
      return;
    }
    try {
      await axios.delete(`/api/departments/${deleteDept.id}`);
      setDeleteDept(null);
      setMessage("Department deleted.");
      setError("");
      if (editDept && editDept.id === deleteDept.id) {
        setEditDept(null);
        setForm({ name: "", description: "" });
      }
      fetchAll();
    } catch {
      setError("Failed to delete department.");
    }
  };

  const handleDeleteClick = (dept) => {
    setDeleteDept(dept);
  };

  const handleDeleteCancel = () => {
    setDeleteDept(null);
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.description.toLowerCase().includes(search.toLowerCase())
  );

  const getEmployeeCount = (deptName) =>
    employees.filter((emp) => emp.department === deptName).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
      <main
        className={`flex-1 p-4 md:p-10 ml-0 md:ml-64 transform transition-transform duration-500 ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-purple-700 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Department Management
            </span>
          </h1>
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

          <form
            className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end border border-purple-100"
            onSubmit={editDept ? handleEditSave : handleAdd}
          >
            <input
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Department Name"
            />
            <input
              className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg w-full transition"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />
            {editDept ? (
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-400 text-white px-4 py-3 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-500 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-500 transition"
              >
                Add
              </button>
            )}
          </form>
          <div className="mb-6 flex justify-end">
            <div className="relative w-full md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-400 pointer-events-none">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="#a78bfa" strokeWidth="2"/>
                  <path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-2 rounded-full border border-purple-200 focus:border-purple-500 outline-none text-base w-full shadow"
              />
            </div>
          </div>
           <div className="bg-white/90 rounded-2xl shadow-2xl border border-purple-100">
            {filteredDepartments.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xl font-medium tracking-wide">
                <span className="inline-block animate-bounce text-4xl mb-2">🏢</span>
                <br />
                No departments found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-purple-100">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      <span className="mr-2">🏢</span>Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-50">
                  {filteredDepartments.map((dept) => {
                    let icon = "🏢";
                    if (dept.name.toLowerCase().includes("hr")) icon = "🧑‍💼";
                    else if (dept.name.toLowerCase().includes("it")) icon = "💻";
                    else if (dept.name.toLowerCase().includes("finance")) icon = "💰";
                    else if (dept.name.toLowerCase().includes("admin")) icon = "🛡️";
                    else if (dept.name.toLowerCase().includes("marketing")) icon = "📈";
                    else if (dept.name.toLowerCase().includes("sales")) icon = "🛒";
                    else if (dept.name.toLowerCase().includes("support")) icon = "🎧";
                    else if (dept.name.toLowerCase().includes("design")) icon = "🎨";
                    else if (dept.name.toLowerCase().includes("operations")) icon = "⚙️";
                    return (
                      <tr key={dept.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-2xl">{icon}</span>
                          {dept.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{dept.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="font-bold text-purple-700">{getEmployeeCount(dept.name)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            className="text-blue-600 hover:underline font-semibold mr-4"
                            onClick={() => handleEditClick(dept)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline font-semibold"
                            onClick={() => handleDeleteClick(dept)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {deleteDept && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Are you sure?
                </h3>
                <p className="mb-6">
                  Do you really want to delete{" "}
                  <span className="font-semibold">{deleteDept.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                  <button
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                    onClick={handleDeleteCancel}
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

export default Department;