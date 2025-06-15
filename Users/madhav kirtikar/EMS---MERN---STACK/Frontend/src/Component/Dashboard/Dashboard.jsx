 import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const USE_DUMMY = false; // Backend aane par false kar dena

const DUMMY_EMPLOYEES = [
  { id: 1, name: "Amit", department: "HR" },
  { id: 2, name: "Priya", department: "IT" },
  { id: 3, name: "Ravi", department: "Finance" },
  { id: 4, name: "Sonal", department: "HR" },
];

const DUMMY_DEPARTMENTS = [
  { id: 1, name: "HR" },
  { id: 2, name: "IT" },
  { id: 3, name: "Finance" },
];

const DUMMY_LEAVES = [
  { id: 1, name: "Amit", status: "Pending" },
  { id: 2, name: "Priya", status: "Approved" },
  { id: 3, name: "Ravi", status: "Pending" },
];

const DUMMY_SALARIES = [
  { id: 1, amount: 50000, status: "Paid" },
  { id: 2, amount: 60000, status: "Paid" },
  { id: 3, amount: 45000, status: "Unpaid" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [leaves, setLeaves] = React.useState([]);
  const [salaries, setSalaries] = React.useState([]);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShow(true), 50);

    if (USE_DUMMY) {
      setEmployees(DUMMY_EMPLOYEES);
      setDepartments(DUMMY_DEPARTMENTS);
      setLeaves(DUMMY_LEAVES);
      setSalaries(DUMMY_SALARIES);
      return;
    }

    // --- Backend API calls (uncomment when backend ready) ---
    
    const fetchAll = async () => {
      try {
        const [empRes, deptRes, leaveRes, salRes] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/departments"),
          axios.get("/api/leaves"),
          axios.get("/api/salaries"),
        ]);
        setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
        setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : []);
        setSalaries(Array.isArray(salRes.data) ? salRes.data : []);
      } catch {
        setEmployees([]);
        setDepartments([]);
        setLeaves([]);
        setSalaries([]);
      }
    };
    fetchAll();
    
  }, []);

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const leavesPending = leaves.filter(l => l.status === "Pending").length;
  const salaryPaid = salaries.filter(s => s.status === "Paid").reduce((acc, s) => acc + Number(s.amount), 0);

  const recentActivity = [
    ...(employees.length > 0 ? [{ type: "employee", text: <>👤 <b>{employees[employees.length - 1].name}</b> joined {employees[employees.length - 1].department} department</> }] : []),
    ...(leaves.length > 0 ? [{ type: "leave", text: <>📝 <b>{leaves[leaves.length - 1].name || "Someone"}</b> applied for leave</> }] : []),
    ...(salaryPaid > 0 ? [{ type: "salary", text: <>💸 Salary processed for <b>{totalEmployees || 0} employees</b></> }] : [])
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
            
      <main
        className={`flex-1 p-4 md:p-10 ml-0 md:ml-64 transform transition-transform duration-500 ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to MyKorperate
            </span>
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-r from-purple-400 to-blue-300 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
              <span className="text-2xl mb-1">👥</span>
              <div className="text-lg font-bold">{totalEmployees || 0}</div>
              <div className="text-xs">Employees</div>
            </div>
            <div className="bg-gradient-to-r from-pink-400 to-purple-300 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
              <span className="text-2xl mb-1">🏢</span>
              <div className="text-lg font-bold">{totalDepartments || 0}</div>
              <div className="text-xs">Departments</div>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-green-300 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
              <span className="text-2xl mb-1">📝</span>
              <div className="text-lg font-bold">{leavesPending || 0}</div>
              <div className="text-xs">Leaves Pending</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-pink-300 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
              <span className="text-2xl mb-1">💸</span>
              <div className="text-lg font-bold">₹{salaryPaid?.toLocaleString() || 0}</div>
              <div className="text-xs">Salary Paid</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center hover:scale-105 transition min-h-[180px]">
              <span className="text-5xl mb-4 text-purple-500">👥</span>
              <h2 className="text-2xl font-bold mb-2 text-purple-700">Manage Employees</h2>
              <p className="text-gray-600 text-center">
                Add, edit, view, and remove employees. Organize your workforce by department and role.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center hover:scale-105 transition min-h-[180px]">
              <span className="text-5xl mb-4 text-blue-500">📊</span>
              <h2 className="text-2xl font-bold mb-2 text-blue-700">Analytics & Reports</h2>
              <p className="text-gray-600 text-center">
                Get insights on employee data, department strength, and salary distribution.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center hover:scale-105 transition min-h-[180px]">
              <span className="text-5xl mb-4 text-pink-500">⚙️</span>
              <h2 className="text-2xl font-bold mb-2 text-pink-700">Admin Tools</h2>
              <p className="text-gray-600 text-center">
                Secure admin panel for managing access, settings, and more.
              </p>
            </div>
          </div>

          {recentActivity.length > 0 && (
            <div className="bg-white rounded-xl shadow p-8 mt-12">
              <h3 className="text-xl font-bold mb-4 text-purple-700">Recent Activity</h3>
              <ul className="space-y-2 text-gray-700">
                {recentActivity.map((item, idx) => (
                  <li key={idx}>{item.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-6 mt-10 justify-center">
            <button
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-purple-600 transition text-lg"
              onClick={() => navigate("/admin/employees")}
            >
              Add Employee
            </button>
            <button
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-600 transition text-lg"
              onClick={() => navigate("/admin/leave")}
            >
              View Leaves
            </button>
            <button
              className="bg-pink-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-pink-600 transition text-lg"
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </button>
          </div>

          <div className="mt-16 text-center">
            <span className="text-xl text-gray-500">
              Use the sidebar to navigate between different sections.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;