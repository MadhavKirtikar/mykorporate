 import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Dummy data for fallback/testing
const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_SALARY = [
  {
    month: "June 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12345",
    date: "2025-06-30",
    bank: "HDFC Bank",
    account: "XXXX1234",
    ifsc: "HDFC0001234",
    pan: "ABCDE1234F",
    deductions: 2000,
    net: 48000,
    remarks: "Performance Bonus Included",
  },
  {
    month: "May 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12344",
    date: "2025-05-31",
    bank: "HDFC Bank",
    account: "XXXX1234",
    ifsc: "HDFC0001234",
    pan: "ABCDE1234F",
    deductions: 2000,
    net: 48000,
    remarks: "",
  },
  {
    month: "April 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12343",
    date: "2025-04-30",
    bank: "HDFC Bank",
    account: "XXXX1234",
    ifsc: "HDFC0001234",
    pan: "ABCDE1234F",
    deductions: 2000,
    net: 48000,
    remarks: "Leave encashment",
  },
];

const SalaryPayslips = ({ user }) => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const payslipRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchSalary = async () => {
      if (USE_DUMMY) {
        setSalaryData(DUMMY_SALARY);
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/salary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSalaryData(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch {
        setSalaryData([]);
        setLoading(false);
      }
    };
    fetchSalary();
  }, [user]);

  // Download payslip as PNG
  const downloadPayslip = async () => {
    if (!payslipRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    html2canvas(payslipRef.current, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `payslip-${selectedPayslip?.month || "salary"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Download all payslips as CSV
  const downloadCSV = () => {
    const header = "Month,Amount,Deductions,Net Salary,Status,Payslip No.,Date,Remarks\n";
    const rows = salaryData.map((s) =>
      [
        s.month,
        s.amount,
        s.deductions || 0,
        s.net || s.amount,
        s.status,
        s.payslip,
        s.date,
        s.remarks ? `"${s.remarks.replace(/"/g, '""')}"` : ""
      ].join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary_payslips.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and sort
  const filteredData = salaryData
    .filter(
      (s) =>
        s.month.toLowerCase().includes(search.toLowerCase()) ||
        (s.remarks && s.remarks.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "amount") return (b.net || b.amount) - (a.net || a.amount);
      if (sortBy === "month") return b.month.localeCompare(a.month);
      // Default: sort by date descending
      return new Date(b.date) - new Date(a.date);
    });

  // Calculate total credited, total deductions, etc.
  const totalCredited = filteredData.reduce((sum, s) => sum + (s.net || s.amount || 0), 0);
  const totalDeductions = filteredData.reduce((sum, s) => sum + (s.deductions || 0), 0);

  // Find highest and lowest net salary
  const highestNet = filteredData.length
    ? Math.max(...filteredData.map((s) => s.net || s.amount))
    : 0;
  const lowestNet = filteredData.length
    ? Math.min(...filteredData.map((s) => s.net || s.amount))
    : 0;

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your salary and payslips.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-2 md:px-0">
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Salary & Payslips
        </span>
      </h2>

      {/* Stats - Clean Cards, Modern, Responsive */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="bg-white border border-green-200 rounded-2xl px-6 py-4 flex flex-col items-center shadow-md min-w-[120px] max-w-[180px] w-full sm:w-auto">
          <span className="text-xs text-green-700 font-semibold mb-1">Total Credited</span>
          <span className="text-2xl font-bold text-green-700">₹{totalCredited}</span>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl px-6 py-4 flex flex-col items-center shadow-md min-w-[120px] max-w-[180px] w-full sm:w-auto">
          <span className="text-xs text-red-700 font-semibold mb-1">Total Deductions</span>
          <span className="text-2xl font-bold text-red-700">₹{totalDeductions}</span>
        </div>
        <div className="bg-white border border-blue-200 rounded-2xl px-6 py-4 flex flex-col items-center shadow-md min-w-[120px] max-w-[180px] w-full sm:w-auto">
          <span className="text-xs text-blue-700 font-semibold mb-1">Payslips</span>
          <span className="text-2xl font-bold text-blue-700">{filteredData.length}</span>
        </div>
        <div className="bg-white border border-purple-200 rounded-2xl px-6 py-4 flex flex-col items-center shadow-md min-w-[120px] max-w-[180px] w-full sm:w-auto">
          <span className="text-xs text-purple-700 font-semibold mb-1">Highest Net</span>
          <span className="text-2xl font-bold text-purple-700">₹{highestNet}</span>
        </div>
        <div className="bg-white border border-pink-200 rounded-2xl px-6 py-4 flex flex-col items-center shadow-md min-w-[120px] max-w-[180px] w-full sm:w-auto">
          <span className="text-xs text-pink-700 font-semibold mb-1">Lowest Net</span>
          <span className="text-2xl font-bold text-pink-700">₹{lowestNet}</span>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search by month or remarks"
          className="px-4 py-2 rounded-full border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-full sm:w-auto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <label className="text-sm font-semibold text-gray-600">Sort by:</label>
          <select
            className="px-3 py-1 rounded-full border border-purple-200 text-sm focus:outline-none"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date">Date (Latest)</option>
            <option value="amount">Net Salary</option>
            <option value="month">Month</option>
          </select>
        </div>
        <button
          className="ml-auto px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xs shadow hover:from-blue-600 hover:to-purple-600 transition"
          onClick={downloadCSV}
        >
          Download All as CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading salary data...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-blue-50">
          <table className="min-w-full rounded-xl text-sm md:text-base">
            <thead>
              <tr>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 rounded-tl-2xl whitespace-nowrap">Month</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Amount</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Deductions</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Net Salary</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Status</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Payslip No.</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Date</th>
                <th className="py-4 px-4 md:px-6 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Remarks</th>
                <th className="py-4 px-4 md:px-6 text-center font-bold text-purple-700 uppercase bg-purple-50 rounded-tr-2xl whitespace-nowrap">Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b last:border-b-0 transition hover:bg-purple-50 ${idx % 2 === 0 ? "bg-white" : "bg-purple-50/60"}`}
                  >
                    <td className="py-3 px-4 md:px-6 font-semibold text-blue-700 whitespace-nowrap">{item.month}</td>
                    <td className="py-3 px-4 md:px-6 font-semibold text-green-700">₹{item.amount}</td>
                    <td className="py-3 px-4 md:px-6 font-semibold text-red-700">₹{item.deductions || 0}</td>
                    <td className="py-3 px-4 md:px-6 font-semibold text-indigo-700">₹{item.net || item.amount}</td>
                    <td className="py-3 px-4 md:px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "Credited" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{item.status}</span>
                    </td>
                    <td className="py-3 px-4 md:px-6">{item.payslip}</td>
                    <td className="py-3 px-4 md:px-6">{new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="py-3 px-4 md:px-6 text-gray-600 text-xs">{item.remarks || <span className="text-gray-300">-</span>}</td>
                    <td className="py-3 px-4 md:px-6 text-center">
                      <button
                        className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-xs shadow hover:from-purple-700 hover:to-blue-600 transition"
                        onClick={() => setSelectedPayslip(item)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 text-lg font-medium">
                    <span className="inline-block animate-bounce text-4xl mb-2">💸</span>
                    <br />
                    No salary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-xs text-gray-400 mt-6 text-center pb-4"></div>
        </div>
      )}

      {/* Payslip Modal - Modern, Centered, Mobile Friendly */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-2 relative flex flex-col items-center animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 text-2xl font-bold"
              onClick={() => setSelectedPayslip(null)}
              title="Close"
            >
              ×
            </button>
            {/* Stylish Payslip */}
            <div
              ref={payslipRef}
              className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-white rounded-xl border border-purple-100 shadow-lg p-6 w-full"
              style={{ minWidth: 260, maxWidth: 400, margin: "0 auto" }}
            >
              {/* Company Logo as BG */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10"
                style={{ zIndex: 0 }}
              >
                <img
                  src="/logo192.png"
                  alt="Company Logo"
                  style={{ width: 100, height: 100, objectFit: "contain", filter: "grayscale(1)" }}
                  draggable={false}
                />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-purple-700 mb-1">Salary Payslip</h3>
                    <span className="text-xs text-gray-500">{selectedPayslip.month}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Payslip No.</span>
                    <span className="font-bold text-indigo-700">{selectedPayslip.payslip}</span>
                  </div>
                </div>
                <hr className="mb-4" />
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">Employee:</span>
                  <span className="text-gray-800">{user?.name || "Employee"}</span>
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">Bank:</span>
                  <span className="text-gray-800">{selectedPayslip.bank || "-"}</span>
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">Account:</span>
                  <span className="text-gray-800">{selectedPayslip.account || "-"}</span>
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">IFSC:</span>
                  <span className="text-gray-800">{selectedPayslip.ifsc || "-"}</span>
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">PAN:</span>
                  <span className="text-gray-800">{selectedPayslip.pan || "-"}</span>
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:justify-between">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-800">{new Date(selectedPayslip.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <hr className="my-4" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Gross Salary</span>
                    <span className="font-bold text-green-700">₹{selectedPayslip.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Deductions</span>
                    <span className="font-bold text-red-700">₹{selectedPayslip.deductions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Net Salary</span>
                    <span className="font-bold text-indigo-700">₹{selectedPayslip.net || selectedPayslip.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Status</span>
                    <span className={`font-bold ${selectedPayslip.status === "Credited" ? "text-green-700" : "text-yellow-700"}`}>{selectedPayslip.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Month</span>
                    <span className="font-bold text-purple-700">{selectedPayslip.month}</span>
                  </div>
                  {selectedPayslip.remarks && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Remarks</span>
                      <span className="font-bold text-pink-700">{selectedPayslip.remarks}</span>
                    </div>
                  )}
                </div>
                <hr className="my-4" />
                <div className="text-center text-xs text-gray-400 mt-2"></div>
              </div>
            </div>
            {/* Download button below the slip */}
            <button
              className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full shadow hover:from-purple-700 hover:to-blue-600 transition text-lg tracking-wider"
              onClick={downloadPayslip}
            >
              Download Payslip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPayslips;