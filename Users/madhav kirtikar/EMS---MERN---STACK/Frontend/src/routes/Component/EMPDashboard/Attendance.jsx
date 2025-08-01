import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_ATTENDANCE = [
  {
    id: 1,
    date: "2025-06-01",
    status: "Present",
    checkIn: "09:10",
    checkOut: "18:00",
    note: "On time",
  },
  {
    id: 2,
    date: "2025-06-02",
    status: "Absent",
    checkIn: "",
    checkOut: "",
    note: "Sick leave",
  },
  {
    id: 3,
    date: "2025-06-03",
    status: "Present",
    checkIn: "09:05",
    checkOut: "18:10",
    note: "",
  },
  {
    id: 4,
    date: "2025-06-04",
    status: "Present",
    checkIn: "09:00",
    checkOut: "18:00",
    note: "",
  },
  {
    id: 5,
    date: "2025-06-05",
    status: "Absent",
    checkIn: "",
    checkOut: "",
    note: "Personal work",
  },
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
    const fetchAttendance = async () => {
      if (USE_DUMMY) {
        setAttendance(DUMMY_ATTENDANCE);
        setLoading(false);
        return;
      }
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

  // Summary Section
  const leavesTaken = absentCount; // For demo, absent = leave

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-400 bg-clip-text text-transparent drop-shadow">
          <FaCalendarAlt className="inline mr-2 text-purple-400" /> Attendance
        </span>
      </h2>

      {/* Stylish Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <input
            type="date"
            className="px-3 py-1 rounded-lg border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by date"
          />
          <select
            className="px-3 py-1 rounded-lg border border-purple-200 text-sm focus:outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <button
          className="ml-auto px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xs shadow flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition"
          onClick={downloadCSV}
        >
          <FaDownload /> Download CSV
        </button>
      </div>

      {/* Summary Section */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="bg-white border border-purple-200 rounded-xl px-6 py-3 flex flex-col items-center shadow min-w-[120px]">
          <span className="text-xs text-purple-700 font-semibold">Total Days</span>
          <span className="text-xl font-bold text-purple-700">{totalDays}</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 flex flex-col items-center shadow min-w-[120px]">
          <span className="text-xs text-green-700 font-semibold">Present %</span>
          <span className="text-xl font-bold text-green-700">{presentPercent}%</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-3 flex flex-col items-center shadow min-w-[120px]">
          <span className="text-xs text-red-700 font-semibold">Leaves Taken</span>
          <span className="text-xl font-bold text-red-700">{leavesTaken}</span>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 flex flex-col items-center shadow min-w-[120px]">
          <span className="text-xs text-blue-700 font-semibold">Longest Streak</span>
          <span className="text-xl font-bold text-blue-700">{getLongestStreak()} days</span>
        </div>
      </div>

      {/* Attendance Table - Zebra stripes, hover, colored badges, icons */}
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
          <table className="min-w-full text-sm md:text-base rounded-xl divide-y divide-purple-100">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-center font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-center font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Check In</th>
                <th className="px-4 py-3 text-center font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Check Out</th>
                <th className="px-4 py-3 text-left font-bold text-purple-700 uppercase bg-purple-50 whitespace-nowrap">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-50">
              {filteredAttendance.map((att, idx) => (
                <tr
                  key={att.id || att._id || idx}
                  className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/60'}`}
                >
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <FaCalendarAlt className="text-purple-400" />
                      {new Date(att.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs flex items-center justify-center gap-1 ${att.status === 'Present' ? 'bg-green-100 text-green-700' : att.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                      title={att.status}
                    >
                      {att.status === 'Present' ? '🟢' : att.status === 'Absent' ? '🔴' : '🟡'} {att.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded px-2 py-0.5 font-mono text-xs" title="Check In Time">
                      <FaClock /> {att.checkIn || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded px-2 py-0.5 font-mono text-xs" title="Check Out Time">
                      <FaClock /> {att.checkOut || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {att.note ? (
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 rounded px-2 py-0.5 text-xs" title={att.note}>
                        <FaMapMarkerAlt /> {att.note}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-6 text-center">
        {/* You can add a footer note or copyright here */}
      </div>
    </div>
  );
};

export default Attendance;