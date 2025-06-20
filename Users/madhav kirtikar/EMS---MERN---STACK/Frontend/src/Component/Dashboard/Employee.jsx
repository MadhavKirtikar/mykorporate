 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const USE_DUMMY = true;

const defaultProfile = "https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=EMP";

const emptyForm = {
  Id: "",
  name: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  address: "",
  salary: "",
  password: "",
  photo: "",
  gender: "",
  age: "",
};

const DUMMY_DEPARTMENTS = [
  { id: 1, name: "HR" },
  { id: 2, name: "IT" },
  { id: 3, name: "Finance" },
];

const DUMMY_EMPLOYEES = [
  {
    id: 1,
    empId: "EMP001",
    name: "Amit",
    department: "HR",
    position: "Manager",
    email: "amit@demo.com",
    phone: "9876543210",
    address: "Delhi",
    salary: "50000",
    password: "123456",
    photo: "",
    gender: "Male",
    age: "32",
    performance: 4.5,
  },
  {
    id: 2,
    empId: "EMP002",
    name: "Priya",
    department: "IT",
    position: "Developer",
    email: "priya@demo.com",
    phone: "9876543211",
    address: "Mumbai",
    salary: "60000",
    password: "123456",
    photo: "",
    gender: "Female",
    age: "28",
    performance: 4.2,
  },
  {
    id: 3,
    empId: "EMP003",
    name: "Ravi",
    department: "Finance",
    position: "Accountant",
    email: "ravi@demo.com",
    phone: "9876543212",
    address: "Pune",
    salary: "45000",
    password: "123456",
    photo: "",
    gender: "Male",
    age: "35",
    performance: 3.9,
  },
];

function generateEmpId(employees) {
  // Find max empId number and increment
  let max = 0;
  employees.forEach(emp => {
    const num = parseInt((emp.empId || "").replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return `EMP${String(max + 1).padStart(3, "0")}`;
}

const Employee = () => {
  const [departmentsList, setDepartmentsList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);
  const [viewEmp, setViewEmp] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addError, setAddError] = useState("");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [showAttendance, setShowAttendance] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editPerformance, setEditPerformance] = useState("");

  // Fetch departments and employees from backend or dummy
  const fetchAll = async () => {
    if (USE_DUMMY) {
      setDepartmentsList(DUMMY_DEPARTMENTS);
      setEmployees(DUMMY_EMPLOYEES);
      return;
    }
    try {
      const [deptRes, empRes] = await Promise.all([
        axios.get("/api/departments"),
        axios.get("/api/employees"),
      ]);
      setDepartmentsList(Array.isArray(deptRes.data) ? deptRes.data : []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
    } catch {
      setDepartmentsList([]);
      setEmployees([]);
    }
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
    fetchAll();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const toUpper = (str) => (str ? str.toUpperCase() : "");

  const totalEmployees = employees.length;
  const totalDepartments = departmentsList.length;
  const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);

  const filteredEmployees = employees.filter(
    (emp) =>
      (!selectedDept || emp.department === selectedDept.name) &&
      (
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.position?.toLowerCase().includes(search.toLowerCase()) ||
        emp.empId?.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAddError("");
  };

  // ADD employee (dummy/backend)
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department) {
      setAddError("Name and Department are required.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setAddError("Password must be at least 6 characters.");
      return;
    }
    if (!form.gender) {
      setAddError("Gender is required.");
      return;
    }
    if (!form.age || isNaN(form.age) || form.age < 18 || form.age > 70) {
      setAddError("Valid age (18-70) is required.");
      return;
    }
    const empId = generateEmpId(employees);
    if (USE_DUMMY) {
      const newEmp = {
        ...form,
        empId,
        id: Date.now(),
        performance: 0,
      };
      setEmployees([...employees, newEmp]);
      setSuccessMsg("Employee added successfully!");
      setForm(emptyForm);
      setShowAddForm(false);
      setAddError("");
      setShowPassword(false);
      return;
    }
    try {
      await axios.post("/api/employees", { ...form, empId, performance: 0 });
      setSuccessMsg("Employee added successfully!");
      setForm(emptyForm);
      setShowAddForm(false);
      setAddError("");
      setShowPassword(false);
      fetchAll();
    } catch {
      setAddError("Failed to add employee.");
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditPerformance(emp.performance || "");
    setSelectedEmp(emp);
    setEditMode(true);
    setShowAddForm(true);
    setShowPassword(false);
  };

  // UPDATE employee (dummy/backend)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department) {
      setAddError("Name and Department are required.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setAddError("Password must be at least 6 characters.");
      return;
    }
    if (!form.gender) {
      setAddError("Gender is required.");
      return;
    }
    if (!form.age || isNaN(form.age) || form.age < 18 || form.age > 70) {
      setAddError("Valid age (18-70) is required.");
      return;
    }
    if (editPerformance && (editPerformance < 1 || editPerformance > 5)) {
      setAddError("Performance rating must be between 1 and 5.");
      return;
    }
    if (USE_DUMMY) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmp.id
            ? { ...form, id: emp.id, empId: emp.empId, performance: editPerformance }
            : emp
        )
      );
      setSuccessMsg("Employee updated successfully!");
      setForm(emptyForm);
      setShowAddForm(false);
      setEditMode(false);
      setSelectedEmp(null);
      setAddError("");
      setShowPassword(false);
      setEditPerformance("");
      return;
    }
    try {
      await axios.put(`/api/employees/${selectedEmp.id}`, { ...form, empId: selectedEmp.empId, performance: editPerformance });
      setSuccessMsg("Employee updated successfully!");
      setForm(emptyForm);
      setShowAddForm(false);
      setEditMode(false);
      setSelectedEmp(null);
      setAddError("");
      setShowPassword(false);
      setEditPerformance("");
      fetchAll();
    } catch {
      setAddError("Failed to update employee.");
    }
  };

  const handleDeleteClick = (emp) => {
    setEmpToDelete(emp);
    setShowDeleteModal(true);
  };

  // DELETE employee (dummy/backend)
  const confirmDelete = async () => {
    if (USE_DUMMY) {
      setEmployees(employees.filter((emp) => emp.id !== empToDelete.id));
      setShowDeleteModal(false);
      setEmpToDelete(null);
      setSelectedEmp(null);
      setEditMode(false);
      setViewEmp(null);
      setSuccessMsg("Employee deleted successfully!");
      return;
    }
    try {
      await axios.delete(`/api/employees/${empToDelete.id}`);
      setShowDeleteModal(false);
      setEmpToDelete(null);
      setSelectedEmp(null);
      setEditMode(false);
      setViewEmp(null);
      setSuccessMsg("Employee deleted successfully!");
      fetchAll();
    } catch {
      setAddError("Failed to delete employee.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmpToDelete(null);
  };

  const handleView = (emp) => {
    setViewEmp(emp);
  };

  const handleAttendanceMark = (empId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [attendanceDate]: {
        ...(prev[attendanceDate] || {}),
        [empId]: status,
      },
    }));
    setSuccessMsg("Attendance marked!");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
      <main
        className={`flex-1 p-2 md:p-6 ml-0 md:ml-64 transform transition-transform duration-500 ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide drop-shadow-lg flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Employee Management
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
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="flex w-full h-full items-center justify-center">
                <form
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto flex flex-col gap-4 relative border border-purple-100"
                  onSubmit={editMode ? handleUpdate : handleAdd}
                  style={{ zIndex: 100, marginLeft: "0", marginRight: "0" }}
                >
                  <h2 className="text-2xl font-bold text-purple-700 mb-2">
                    {editMode ? "Edit Employee" : "Add Employee"}
                  </h2>
                  <table className="w-full mb-4">
                    <tbody>
                      {!editMode && (
                        <tr>
                          <td className="pr-2 py-2 font-semibold text-gray-700">Employee ID</td>
                          <td>
                            <input
                              type="text"
                              name="empId"
                              value={generateEmpId(employees)}
                              className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-500"
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      )}
                      {editMode && (
                        <tr>
                          <td className="pr-2 py-2 font-semibold text-gray-700">Employee ID</td>
                          <td>
                            <input
                              type="text"
                              name="empId"
                              value={form.empId}
                              className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-500"
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Name</td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            required
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Gender</td>
                        <td>
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Age</td>
                        <td>
                          <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={form.age}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            min={18}
                            max={70}
                            required
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Department</td>
                        <td>
                          <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            required
                            disabled={departmentsList.length === 0}
                          >
                            <option value="">Select Department</option>
                            {departmentsList.map((dept, idx) => (
                              <option key={dept.id || dept.name + idx} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Position</td>
                        <td>
                          <input
                            type="text"
                            name="position"
                            placeholder="Position"
                            value={form.position}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Email</td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Phone</td>
                        <td>
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Address</td>
                        <td>
                          <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Salary</td>
                        <td>
                          <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={form.salary}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                      {editMode && (
                        <tr>
                          <td className="pr-2 py-2 font-semibold text-gray-700">Performance</td>
                          <td>
                            <input
                              type="number"
                              name="performance"
                              placeholder="Performance Rating (1-5)"
                              value={editPerformance}
                              onChange={(e) => setEditPerformance(e.target.value)}
                              min={1}
                              max={5}
                              step={0.1}
                              className="border rounded px-3 py-2 w-full"
                            />
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="pr-2 py-2 font-semibold text-gray-700">Password</td>
                        <td>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Password"
                              value={form.password}
                              onChange={handleChange}
                              className="border rounded px-3 py-2 w-full pr-10"
                              required
                            />
                            <button
                              type="button"
                              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl transition-colors duration-200 ${
                                showPassword ? "text-purple-600" : "text-gray-400"
                              } hover:text-purple-500`}
                              onClick={() => setShowPassword((prev) => !prev)}
                              tabIndex={-1}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                            >
                              {showPassword ? (
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2"/>
                                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                              ) : (
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                  <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-6.06M1 1l22 22" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                         <td>
                          <input
                            type="text"
                            name="photo"
                            placeholder="Photo URL"
                            value={form.photo}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {addError && <div className="text-red-500">{addError}</div>}
                  <div className="flex gap-4 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => {
                        setShowAddForm(false);
                        setForm(emptyForm);
                        setEditMode(false);
                        setSelectedEmp(null);
                        setShowPassword(false);
                        setEditPerformance("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      {editMode ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:from-purple-600 hover:to-blue-500 text-xl transition"
              onClick={() => {
                setShowAddForm(true);
                setForm(emptyForm);
                setEditMode(false);
                setSelectedEmp(null);
                setShowPassword(false);
                setEditPerformance("");
              }}
              disabled={departmentsList.length === 0}
            >
              Add Employee
            </button>
            <div className="relative w-full md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-400 pointer-events-none">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" stroke="#a78bfa" strokeWidth="2"/>
                  <path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name, emp id or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-10 py-2 rounded-full border border-purple-200 focus:border-purple-500 outline-none text-base w-full shadow"
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  tabIndex={-1}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
              onClick={() => setShowAttendance((prev) => !prev)}
            >
              {showAttendance ? "Hide Attendance" : "Mark Attendance"}
            </button>
          </div>
          {showAttendance && (
            <div className="mb-10 bg-white/80 rounded-2xl shadow-2xl p-8 border border-purple-100">
              <h2 className="text-lg font-bold mb-4 text-purple-700 flex items-center gap-2">
                <span>Attendance</span>
                <span className="text-base text-gray-500 font-normal">(Mark for all employees)</span>
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <label className="font-semibold text-gray-700">
                  Date:{" "}
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border border-purple-200 rounded px-3 py-1 ml-2"
                  />
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-100">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Emp ID</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">Department</th>
                      <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-purple-50">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-400 py-6">
                          <span className="flex flex-col items-center gap-2">
                            <span className="animate-bounce flex justify-center">
                              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="4" height="10" rx="1" fill="#a78bfa"/>
                                <rect x="9.5" y="7" width="4" height="14" rx="1" fill="#818cf8"/>
                                <rect x="16" y="3" width="4" height="18" rx="1" fill="#38bdf8"/>
                              </svg>
                            </span>
                            No employees to mark attendance.
                          </span>
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => (
                        <tr key={emp.id}>
                          <td className="px-4 py-2 font-semibold text-gray-700">{emp.empId}</td>
                          <td className="px-4 py-2 font-semibold text-gray-700">{toUpper(emp.name)}</td>
                          <td className="px-4 py-2">{emp.department}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              className={`px-3 py-1 rounded-full mr-2 font-semibold shadow text-xs ${
                                attendance[attendanceDate]?.[emp.id] === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => handleAttendanceMark(emp.id, "Present")}
                            >
                              Present
                            </button>
                            <button
                              className={`px-3 py-1 rounded-full font-semibold shadow text-xs ${
                                attendance[attendanceDate]?.[emp.id] === "Absent"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => handleAttendanceMark(emp.id, "Absent")}
                            >
                              Absent
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{totalEmployees}</div>
              <div className="text-gray-600">Total Employees</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{totalDepartments}</div>
              <div className="text-gray-600">Departments</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-700">₹{totalSalary}</div>
              <div className="text-gray-600">Total Salary</div>
            </div>
          </div>
          {!viewEmp && (
            <>
              {departmentsList.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-4 justify-center transition-all duration-500 ease-in-out animate-slidein">
                  {departmentsList.map((dept, idx) => (
                    <button
                      key={dept.id || dept.name + idx}
                      className={`px-6 py-2 rounded-xl font-bold shadow text-base border-2 transition-all duration-200 ${
                        selectedDept && selectedDept.name === dept.name
                          ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white scale-105 border-purple-400"
                          : "bg-white text-purple-700 border-purple-200 hover:bg-purple-100"
                      }`}
                      onClick={() => {
                        setSelectedDept(dept);
                        setSelectedEmp(null);
                      }}
                    >
                      {dept.name}
                    </button>
                  ))}
                  <button
                    className={`px-6 py-2 rounded-xl font-bold shadow text-base border-2 transition-all duration-200 bg-white text-purple-700 border-purple-200 hover:bg-purple-100`}
                    onClick={() => setSelectedDept(null)}
                  >
                    All
                  </button>
                </div>
              )}
              <div
                className={`transition-transform duration-500 ease-in-out ${
                  selectedDept && !selectedEmp
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
              >
                {selectedDept && !selectedEmp && (
                  <div className="bg-white/95 rounded-2xl shadow-2xl border border-purple-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-purple-700">
                        {selectedDept.name} Employees
                      </h2>
                      <button
                        className="text-purple-500 hover:underline font-semibold"
                        onClick={() => setSelectedDept(null)}
                      >
                        &larr; All Departments
                      </button>
                    </div>
                    {filteredEmployees.length === 0 ? (
                      <div className="text-gray-400 text-base text-center py-6">
                        <span className="flex flex-col items-center gap-2">
                          <span className="animate-bounce flex justify-center">
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="11" width="4" height="10" rx="1" fill="#a78bfa"/>
                              <rect x="9.5" y="7" width="4" height="14" rx="1" fill="#818cf8"/>
                              <rect x="16" y="3" width="4" height="18" rx="1" fill="#38bdf8"/>
                            </svg>
                          </span>
                          No employees found in this department.
                        </span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-purple-100">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                                Emp ID
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                                Position
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                                Email
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-purple-50">
                            {filteredEmployees.map((emp) => (
                              <tr
                                key={emp.id}
                                className="hover:bg-purple-50 transition"
                              >
                                <td className="px-4 py-2 font-semibold text-blue-700">{emp.empId}</td>
                                <td className="px-4 py-2 font-semibold text-gray-700">
                                  {toUpper(emp.name)}
                                </td>
                                <td className="px-4 py-2">
                                  {toUpper(emp.position)}
                                </td>
                                <td className="px-4 py-2">{emp.email}</td>
                                <td className="px-4 py-2 flex gap-2 justify-center">
                                  <button
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                                    onClick={() => handleView(emp)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                    onClick={() => handleEdit(emp)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                    onClick={() => handleDeleteClick(emp)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!selectedDept && (
                <div className="bg-white/95 rounded-2xl shadow-2xl border border-purple-100 p-6 transition-transform duration-500 ease-in-out">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-700">
                      All Employees
                    </h2>
                  </div>
                  {filteredEmployees.length === 0 ? (
                     <div className="mt-8 text-center text-gray-500">
                {employees.length === 0 && (
                  <span className="flex flex-col items-center gap-2">
                    <span className="animate-bounce flex justify-center">
                      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#a78bfa"/>
                        <rect x="6" y="14" width="12" height="6" rx="3" fill="#818cf8"/>
                      </svg>
                    </span>
                    No employees found.
                  </span>
                )}
              </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-purple-100">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                              Emp ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                              Position
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-purple-700 uppercase">
                              Email
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-purple-700 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-purple-50">
                          {filteredEmployees.map((emp) => (
                            <tr
                              key={emp.id}
                              className="hover:bg-purple-50 transition"
                            >
                              <td className="px-4 py-2 font-semibold text-blue-700">{emp.empId}</td>
                              <td className="px-4 py-2 font-semibold text-gray-700">
                                {toUpper(emp.name)}
                              </td>
                              <td className="px-4 py-2">
                                {toUpper(emp.position)}
                              </td>
                              <td className="px-4 py-2">{emp.email}</td>
                              <td className="px-4 py-2 flex gap-2 justify-center">
                                <button
                                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                                  onClick={() => handleView(emp)}
                                >
                                  View
                                </button>
                                <button
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                  onClick={() => handleEdit(emp)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                  onClick={() => handleDeleteClick(emp)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-8 text-center text-gray-500">
                {employees.length === 0 && (
                  <span className="flex flex-col items-center gap-2">
                    <span className="animate-bounce flex justify-center"></span>
                    No employees yet. Click 'Add Employee' to get started!
                  </span>
                )}
              </div>
            </>
          )}
          {viewEmp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-slidein">
              <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl mx-auto flex flex-col items-center relative">
                <img
                  src={
                    viewEmp.photo
                      ? viewEmp.photo
                      : `${defaultProfile}&name=${encodeURIComponent(
                          viewEmp.name || "EMP"
                        )}`
                  }
                  alt="Profile"
                  className="w-56 h-56 rounded-full border-8 border-purple-300 shadow-2xl mb-6 object-cover bg-gray-100"
                />
                <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
                  {toUpper(viewEmp.name)}
                </h2>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  {toUpper(viewEmp.position)}
                </h3>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-lg">
                  <div>
                    <span className="font-semibold text-gray-600">Emp ID:</span> {viewEmp.empId}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Department:</span> {viewEmp.department}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Email:</span> {viewEmp.email}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Phone:</span> {viewEmp.phone}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Address:</span> {viewEmp.address}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Salary:</span> ₹{viewEmp.salary}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Performance:</span> {viewEmp.performance || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Gender:</span> {viewEmp.gender || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Age:</span> {viewEmp.age || "N/A"}
                  </div>
                </div>
                <div className="flex w-full justify-center gap-4 mt-2">
                  <button
                    className={`px-5 py-2 rounded-full font-semibold shadow text-base ${
                      attendance[attendanceDate]?.[viewEmp.id] === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleAttendanceMark(viewEmp.id, "Present")}
                  >
                    Present
                  </button>
                  <button
                    className="px-10 py-3 bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-xl font-bold shadow hover:from-purple-600 hover:to-blue-500 transition text-lg"
                    onClick={() => setViewEmp(null)}
                  >
                    Close
                  </button>
                  <button
                    className={`px-5 py-2 rounded-full font-semibold shadow text-base ${
                      attendance[attendanceDate]?.[viewEmp.id] === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleAttendanceMark(viewEmp.id, "Absent")}
                  >
                    Absent
                  </button>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Are you sure?
                </h3>
                <p className="mb-6">
                  Do you really want to delete{" "}
                  <span className="font-semibold">
                    {empToDelete?.name && toUpper(empToDelete.name)}
                  </span>
                  ? This action cannot be undone.
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

export default Employee;