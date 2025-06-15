 import React, { useEffect, useState } from "react";
import axios from "axios";

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_SALARY = [
  {
    month: "June 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12345",
    date: "2025-06-30",
  },
  {
    month: "May 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12344",
    date: "2025-05-31",
  },
  {
    month: "April 2025",
    amount: 50000,
    status: "Credited",
    payslip: "#12343",
    date: "2025-04-30",
  },
];

const SalaryPayslips = ({ user }) => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your salary and payslips.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Salary & Payslips
        </span>
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading salary data...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-blue-50">
          <table className="min-w-full rounded-xl">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tl-2xl">
                  Month
                </th>
                <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                  Amount
                </th>
                <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                  Payslip No.
                </th>
                <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tr-2xl">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {salaryData.length > 0 ? (
                salaryData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b last:border-b-0 transition hover:bg-purple-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-purple-50/60"
                    }`}
                  >
                    <td className="py-3 px-6 font-semibold text-blue-700 whitespace-nowrap">
                      {item.month}
                    </td>
                    <td className="py-3 px-6 font-semibold text-green-700">
                      ₹{item.amount}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "Credited"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">{item.payslip}</td>
                    <td className="py-3 px-6">
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-lg font-medium">
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
    </div>
  );
};

export default SalaryPayslips;