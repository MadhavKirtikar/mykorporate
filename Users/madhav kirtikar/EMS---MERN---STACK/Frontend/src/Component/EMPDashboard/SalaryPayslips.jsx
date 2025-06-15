 import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const SalaryPayslips = ({ user }) => {
  const [payslips, setPayslips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const slipRef = useRef();

  // Fetch payslips from backend
  useEffect(() => {
    if (!user) return;
    const fetchPayslips = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/payslips", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayslips(Array.isArray(res.data) ? res.data : []);
      } catch {
        setPayslips([]);
      }
    };
    fetchPayslips();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your salary and payslips.
      </div>
    );
  }

  // Filter and search logic
  const filteredPayslips =
    filter === "All"
      ? payslips
      : payslips.filter((p) => p.status === filter);

  const searchedPayslips = search
    ? filteredPayslips.filter((p) =>
        p.month.toLowerCase().includes(search.toLowerCase())
      )
    : filteredPayslips;

  // Count and percentage
  const paidCount = payslips.filter((p) => p.status === "Paid").length;
  const unpaidCount = payslips.filter((p) => p.status === "Unpaid").length;
  const percent = payslips.length
    ? Math.round((paidCount / payslips.length) * 100)
    : 0;

  // Download as CSV
  const downloadCSV = () => {
    const rows = [
      ["Month", "Salary", "Status"],
      ...searchedPayslips.map((p) => [p.month, p.salary, p.status]),
    ];
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary_payslips.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (payslip) => {
    setSelectedSlip(payslip);
    setTimeout(async () => {
      const element = slipRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${user.name}_${payslip.month}_payslip.pdf`);
      setSelectedSlip(null);
    }, 100);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl p-8 mt-8">
      {/* Title same style as Settings/Calendar/Notifications/Leaves */}
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Salary & Payslips
        </span>
      </h2>

      {/* Attendance Percentage */}
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-purple-700">
          Payslip Paid:
        </span>
        <div className="w-40 bg-purple-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-400 h-3 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <span className="font-bold text-purple-700">{percent}%</span>
      </div>

      {/* Paid/Unpaid Count */}
      <div className="flex justify-end gap-6 mb-2 text-sm">
        <span className="flex items-center gap-1 text-green-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Paid: {paidCount}
        </span>
        <span className="flex items-center gap-1 text-red-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          Unpaid: {unpaidCount}
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["All", "Paid", "Unpaid"].map((type) => (
          <button
            key={type}
            className={`px-4 py-1 rounded-full text-xs font-bold border shadow-sm ${
              filter === type
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white border-purple-600"
                : "bg-purple-50 text-purple-700 border-purple-200"
            } transition`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search by Month */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
        <input
          type="text"
          placeholder="Search by month (e.g. June)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 mb-2 md:mb-0"
        />
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-bold hover:from-purple-700 hover:to-blue-600 shadow transition text-xs"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="min-w-full rounded-xl">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-purple-700 text-sm font-bold uppercase">Month</th>
              <th className="py-3 px-4 text-left text-purple-700 text-sm font-bold uppercase">Salary</th>
              <th className="py-3 px-4 text-left text-purple-700 text-sm font-bold uppercase">Status</th>
              <th className="py-3 px-4 text-left text-purple-700 text-sm font-bold uppercase">Payslip</th>
            </tr>
          </thead>
          <tbody>
            {searchedPayslips.map((p, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-purple-50 transition">
                <td className="py-3 px-4 font-semibold">{p.month}</td>
                <td className="py-3 px-4 font-semibold text-blue-700">₹{p.salary?.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                    p.status === "Paid"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}>
                    {p.status === "Paid" ? "✔️" : "❌"} {p.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-lg font-bold hover:from-purple-700 hover:to-blue-600 transition text-sm shadow"
                    onClick={() => handleDownload(p)}
                  >
                    Download
                  </button>
                  {selectedSlip && selectedSlip.month === p.month && (
                    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                      <PayslipSlip
                        ref={slipRef}
                        user={user}
                        payslip={selectedSlip}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {searchedPayslips.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  No payslips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PayslipSlip = React.forwardRef(({ user, payslip }, ref) => (
  <div
    ref={ref}
    className=" "
    style={{}}
  >
    {/* Header with company name and logo */}
    <div className="flex justify-between items-center mb-8 border-b-2 border-purple-100 pb-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {/* Company Logo - replace src with your logo path if needed */}
          <img
            src="/company-logo.png"
            alt="Company Logo"
            className="w-12 h-12 rounded-full border-2 border-purple-300"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <span className="text-xl font-bold text-purple-700">Your Company Pvt. Ltd.</span>
        </div>
        <div className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 bg-clip-text drop-shadow-lg tracking-wide uppercase">
          Salary Slip
        </div>
        <div className="text-lg text-purple-500 font-semibold mt-1">{payslip.month}</div>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`}
          alt={user.name}
          className="w-20 h-20 rounded-full border-4 border-purple-300 shadow"
        />
        <span className="text-xs text-purple-400 font-semibold mt-2">Employee</span>
      </div>
    </div>
    {/* Employee Info */}
    <div className="mb-8 grid grid-cols-2 gap-4 text-base">
      <div>
        <span className="font-semibold text-purple-700">Employee Name:</span>
        <span className="ml-2 text-gray-800">{user.name}</span>
      </div>
      <div>
        <span className="font-semibold text-purple-700">Position:</span>
        <span className="ml-2 text-gray-800">{user.position}</span>
      </div>
      <div>
        <span className="font-semibold text-purple-700">Employee ID:</span>
        <span className="ml-2 text-gray-800">{user.employeeId || "-"}</span>
      </div>
      <div>
        <span className="font-semibold text-purple-700">Department:</span>
        <span className="ml-2 text-gray-800">{user.department || "-"}</span>
      </div>
    </div>
    {/* Salary Table */}
    <table className="w-full mb-8 text-base border border-purple-100 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-purple-50">
          <th className="py-2 px-4 text-left font-bold text-purple-700">Component</th>
          <th className="py-2 px-4 text-right font-bold text-purple-700">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 font-semibold">Basic Salary</td>
          <td className="py-2 px-4 text-right">₹{payslip.details?.basic?.toLocaleString()}</td>
        </tr>
        <tr className="bg-purple-50">
          <td className="py-2 px-4 font-semibold">HRA</td>
          <td className="py-2 px-4 text-right">₹{payslip.details?.hra?.toLocaleString()}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-semibold">Allowance</td>
          <td className="py-2 px-4 text-right">₹{payslip.details?.allowance?.toLocaleString()}</td>
        </tr>
        <tr className="bg-purple-50">
          <td className="py-2 px-4 font-semibold">Deductions</td>
          <td className="py-2 px-4 text-right">₹{payslip.details?.deductions?.toLocaleString()}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-bold text-purple-700 text-lg border-t-2 border-purple-200">Net Salary</td>
          <td className="py-2 px-4 text-right font-bold text-purple-700 text-lg border-t-2 border-purple-200">
            ₹{payslip.details?.net?.toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
    {/* Footer */}
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-2">
      <div></div>
      <div className="text-xs text-purple-400 font-semibold">
        Generated on: {new Date().toLocaleDateString("en-IN")}
      </div>
    </div>
  </div>
));

export default SalaryPayslips;