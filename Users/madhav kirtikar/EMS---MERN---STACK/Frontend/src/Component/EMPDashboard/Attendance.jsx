import React, { useEffect, useState } from "react";
import axios from "axios";

const USE_DUMMY = true; // Jab backend aayega, sirf isko false kar dena

const DUMMY_ATTENDANCE = [
  { id: 1, date: "2024-06-01", status: "Present", checkIn: "09:10", checkOut: "18:00", note: "On time" },
  { id: 2, date: "2024-06-02", status: "Absent", checkIn: "", checkOut: "", note: "Sick leave" },
  { id: 3, date: "2024-06-03", status: "Present", checkIn: "09:05", checkOut: "18:10", note: "" },
  { id: 4, date: "2024-06-04", status: "Present", checkIn: "09:00", checkOut: "18:00", note: "Perfect" },
  { id: 5, date: "2024-06-05", status: "Absent", checkIn: "", checkOut: "", note: "Personal" },
];

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    if (USE_DUMMY) {
      setTimeout(() => {
        setAttendance(DUMMY_ATTENDANCE);
        setLoading(false);
      }, 500);
      return;
    }
    // Backend fetch
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/api/attendance/me");
        setAttendance(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch {
        setError("Failed to load attendance.");
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Filtered attendance
  const filteredAttendance = attendance
    .filter((a) =>
      filter === "All" ? true : a.status === filter
    )
    .filter((a) =>
      search
        ? a.date.includes(search) ||
          (a.note && a.note.toLowerCase().includes(search.toLowerCase()))
        : true
    );

  // Count
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const totalDays = attendance.length;
  const presentPercent = totalDays ? ((presentCount / totalDays) * 100).toFixed(1) : 0;
  const absentPercent = totalDays ? ((absentCount / totalDays) * 100).toFixed(1) : 0;

  // Extra: Find longest present streak
  const getLongestStreak = () => {
    let max = 0, curr = 0;
    attendance.forEach((a) => {
      if (a.status === "Present") {
        curr++;
        if (curr > max) max = curr;
      } else {
        curr = 0;
      }
    });
    return max;
  };

  // Extra: Download as CSV
  const downloadCSV = () => {
    const header = "Date,Status,Check In,Check Out,Note\n";
    const rows = attendance.map(a =>
      [
        a.date,
        a.status,
        a.checkIn || "-",
        a.checkOut || "-",
        a.note ? `"${a.note.replace(/"/g, '""')}"` : ""
      ].join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Extra: Mark today as present (dummy only)
  const markTodayPresent = () => {
    if (USE_DUMMY) {
      const today = new Date().toISOString().slice(0, 10);
      if (attendance.some(a => a.date === today)) return;
      setAttendance([
        ...attendance,
        {
          id: Date.now(),
          date: today,
          status: "Present",
          checkIn: "09:00",
          checkOut: "",
          note: "Self marked",
        },
      ]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-white rounded-3xl shadow-2xl p-8 mt-10 border border-purple-200">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-extrabold text-purple-700 flex items-center gap-2 drop-shadow">
          <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            My Attendance
          </span>
        </h2>
        <div className="flex-1 flex flex-wrap gap-2 md:justify-end">
          <button
            className="px-4 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 transition"
            onClick={() => setShowStats((s) => !s)}
          >
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
          <button
            className="px-4 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
          {USE_DUMMY && (
            <button
              className="px-4 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition"
              onClick={markTodayPresent}
            >
              Mark Today Present
            </button>
          )}
        </div>
      </div>

      {/* Present/Absent Count */}
      <div className="flex flex-wrap gap-4 justify-end mb-4 text-base font-semibold">
        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full shadow-sm">
          Present: {presentCount}
        </span>
        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full shadow-sm">
          Absent: {absentCount}
        </span>
        <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full shadow-sm">
          Total: {totalDays}
        </span>
      </div>

      {/* Extra: Stats */}
      {showStats && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-100 flex flex-wrap gap-8 justify-between text-base font-medium shadow">
          <div>
            <span className="font-bold text-purple-700">Present %:</span> {presentPercent}%
          </div>
          <div>
            <span className="font-bold text-purple-700">Absent %:</span> {absentPercent}%
          </div>
          <div>
            <span className="font-bold text-purple-700">Longest Present Streak:</span> {getLongestStreak()} days
          </div>
        </div>
      )}

      {/* Filter/Search */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Present", "Absent"].map((type) => (
          <button
            key={type}
            className={`px-4 py-1 rounded-full text-sm font-bold border ${
              filter === type
                ? "bg-purple-600 text-white border-purple-600 shadow"
                : "bg-purple-50 text-purple-700 border-purple-200"
            } transition`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search date or note"
          className="ml-auto px-4 py-1 rounded-full border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12 text-lg font-semibold animate-pulse">
          Loading attendance...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-12 text-lg font-semibold">{error}</div>
      ) : filteredAttendance.length === 0 ? (
        <div className="text-gray-400 text-center py-12 text-lg font-medium">
          <span className="inline-block animate-bounce text-4xl mb-2">📅</span>
          <br />
          No attendance records found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow border border-purple-100 bg-white/90">
          <table className="min-w-full divide-y divide-purple-100">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-700 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase">Check In</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase">Check Out</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-purple-700 uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-50">
              {filteredAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-purple-50 transition">
                  <td className="px-4 py-2 font-medium">
                    {new Date(att.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs flex items-center justify-center gap-1 ${
                        att.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {att.status === "Present" ? "✔️" : "❌"} {att.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{att.checkIn || "-"}</td>
                  <td className="px-4 py-2 text-center">{att.checkOut || "-"}</td>
                  <td className="px-4 py-2">{att.note || <span className="text-gray-300">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-6 text-center">
       </div>
    </div>
  );
};

export default Attendance;