 import React, { useState, useEffect } from "react";
import axios from "axios";

const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_EVENTS = [
  {
    date: "2025-06-15",
    title: "Team Meeting",
    description: "Monthly team sync at 11:00 AM.",
  },
  {
    date: "2025-06-16",
    title: "Project Deadline",
    description: "Submit all project deliverables.",
  },
  {
    date: "2025-06-18",
    title: "HR Workshop",
    description: "Attend HR workshop in conference room.",
  },
];

const CalenderEvents = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (USE_DUMMY) {
      setEvents(DUMMY_EVENTS);
      setLoading(false);
      return;
    }
    axios
      .get("/api/events")
      .then((res) => {
        setEvents(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Show a highlight if a new event is added today
  useEffect(() => {
    if (events.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const latest = events.find(e => e.date === today);
      if (latest) setNewEvent(latest);
      else setNewEvent(null);
    }
  }, [events]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Please login to view your calendar and events.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Loading events...
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-4xl font-extrabold text-center tracking-wide mb-10">
        <span className="bg-gradient-to-r from-purple-500 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow">
          Calender Events
        </span>
      </h2>
      <div className="flex justify-between items-center mb-8"></div>
      {newEvent && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-4 shadow animate-pulse">
          <span className="text-2xl">🆕</span>
          <div>
            <span className="font-bold text-green-700">New Event Today:</span>{" "}
            <span className="font-semibold">{newEvent.title}</span> - {newEvent.description}
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-3xl shadow-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <table className="min-w-full rounded-xl">
          <thead>
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tl-2xl">
                Date
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50">
                Title
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-purple-700 uppercase bg-purple-50 rounded-tr-2xl">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-b-0 transition hover:bg-purple-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-purple-50/60"
                  }`}
                >
                  <td className="py-3 px-6 font-semibold text-blue-700 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow border border-blue-200">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-bold text-purple-700">{event.title}</td>
                  <td className="py-3 px-6">{event.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400 text-lg font-medium">
                  <span className="inline-block animate-bounce text-4xl mb-2">📅</span>
                  <br />
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-xs text-gray-400 mt-6 text-center pb-4"></div>
      </div>
    </div>
  );
};

export default CalenderEvents;