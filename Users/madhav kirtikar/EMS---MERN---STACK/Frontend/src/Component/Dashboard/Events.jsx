 import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
//import axios from "axios";

const USE_DUMMY = true; // Backend aane par false kar dena

const DUMMY_EVENTS = [
  { id: 1, type: "Holiday", title: "Independence Day", date: "2025-08-15", details: "National Holiday" },
  { id: 2, type: "Function", title: "Annual Day", date: "2025-12-20", details: "Cultural Program" },
];

const typeColors = {
  Holiday: "bg-green-100 text-green-700 border-green-300",
  Event: "bg-blue-100 text-blue-700 border-blue-300",
  Function: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Announcement: "bg-pink-100 text-pink-700 border-pink-300",
  Meeting: "bg-indigo-100 text-indigo-700 border-indigo-300",
  Workshop: "bg-orange-100 text-orange-700 border-orange-300",
  Reminder: "bg-gray-100 text-gray-700 border-gray-300",
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ type: "Holiday", title: "", date: "", details: "" });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (USE_DUMMY) {
      setEvents(DUMMY_EVENTS);
      return;
    }
    // Backend API call
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    if (USE_DUMMY) {
      setEvents([
        ...events,
        { ...form, id: Date.now() }
      ]);
      setForm({ type: "Holiday", title: "", date: "", details: "" });
      return;
    }
    // Backend add
    // await axios.post("/api/events", form);
    // fetch events again or update state accordingly
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    if (USE_DUMMY) {
      setEvents(events.filter(ev => ev.id !== deleteId));
      setDeleteId(null);
      return;
    }
    // Backend delete
    // await axios.delete(`/api/events/${deleteId}`);
    // fetch events again or update state accordingly
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-10 ml-0 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-600 via-red-400 to-blue-500 bg-clip-text text-transparent">
              Holidays, Events & Announcements
            </span>
          </h1>
          {/* Form Section */}
          <form
            onSubmit={handleAdd}
            className="bg-white/90 rounded-2xl shadow-2xl p-8 mb-10 border border-purple-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="border-2 border-purple-200 p-3 rounded-lg font-semibold w-full focus:border-purple-500 transition"
                >
                  <option value="Holiday">Holiday</option>
                  <option value="Event">Event</option>
                  <option value="Function">Function</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  className="border-2 border-purple-200 p-3 rounded-lg w-full font-medium focus:border-purple-500 transition"
                  required
                />
              </div>
              {/* Date - Stylish */}
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border-2 border-purple-200 p-3 rounded-lg w-full focus:border-purple-500 transition font-semibold text-purple-700 pr-10"
                    required
                  />
                </div>
              </div>
              {/* Details */}
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Details
                </label>
                <input
                  type="text"
                  name="details"
                  placeholder="Details"
                  value={form.details}
                  onChange={handleChange}
                  className="border-2 border-purple-200 p-3 rounded-lg w-full focus:border-purple-500 transition"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-8 py-3 rounded-lg font-bold shadow hover:from-purple-600 hover:to-blue-500 transition"
              >
                Add
              </button>
            </div>
          </form>
          {/* Delete Warning Modal */}
          {deleteId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full border border-red-200">
                <h3 className="text-xl font-bold text-red-600 mb-4">Are you sure?</h3>
                <p className="mb-6 text-gray-700">This entry will be <span className="font-semibold text-red-500">permanently deleted</span>!<br />You cannot undo this action.</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-600 hover:to-pink-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* List Section */}
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-purple-100">
            <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2">
              <span>All Entries</span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{events.length}</span>
            </h2>
            {events.length === 0 ? (
              <div className="text-gray-400 text-center py-8 text-lg">No entries yet.</div>
            ) : (
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(ev => (
                  <div
                    key={ev.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-8 rounded-xl shadow p-5 transition hover:scale-[1.01] ${typeColors[ev.type] || "bg-gray-100 text-gray-700 border-gray-300"}`}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-current bg-white/60">
                          {ev.type}
                        </span>
                        <span className="font-semibold text-lg">{ev.title}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(ev.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {ev.details && (
                        <div className="text-gray-600 text-base">{ev.details}</div>
                      )}
                    </div>
                    <button
                      onClick={() => confirmDelete(ev.id)}
                      className="text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition self-start md:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEvents;