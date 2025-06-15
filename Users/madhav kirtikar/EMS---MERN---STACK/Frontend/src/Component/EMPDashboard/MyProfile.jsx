 import React, { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = ({ profile, setProfile }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);
  const [photoPreview, setPhotoPreview] = useState(profile.photo);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/employee/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setForm(res.data);
        setPhotoPreview(res.data.photo);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setForm(profile);
    setPhotoPreview(profile.photo);
  }, [profile]);

  const handleEdit = () => {
    setForm(profile);
    setPhotoPreview(profile.photo);
    setEdit(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile to backend
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/api/employee/me",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setEdit(false);
    } catch {
      alert("Failed to update profile.");
    }
  };

  const adminFields = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
    { label: "Age", name: "age", type: "number", min: 18, max: 100 },
    { label: "Department", name: "department", type: "text" },
    { label: "Position", name: "position", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Joining Date", name: "joiningDate", type: "date" },
    { label: "Salary", name: "salary", type: "number" }
  ];

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img
          src={
            photoPreview
              ? photoPreview
              : `https://ui-avatars.com/api/?name=${form.name || ""}&background=8b5cf6&color=fff`
          }
          alt={form.name}
          className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg mb-4 object-cover"
        />
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 bg-clip-text drop-shadow-lg mb-1 tracking-wide uppercase">
          {form.name}
        </h2>
        <p className="text-lg font-semibold text-purple-700 bg-purple-100 px-4 py-1 rounded-full shadow-sm tracking-wider uppercase mt-6">
          {form.position}
        </p>
      </div>

      {edit ? (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 w-full">
              <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-4 py-2 rounded-lg shadow transition">
                Add Profile
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500 italic">
                {photoPreview ? "File selected" : "No file chosen"}
              </span>
            </div>
          </div>
          {adminFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-purple-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.type === "date"
                      ? (form[field.name] ? form[field.name].slice(0, 10) : "")
                      : (form[field.name] || "")
                  }
                  onChange={handleChange}
                  min={field.min}
                  max={field.max}
                  required={field.required}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              )}
            </div>
          ))}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {adminFields.map((field) => (
            <div className="flex justify-between" key={field.name}>
              <span className="font-semibold text-purple-700">{field.label}:</span>
              <span>
                {field.type === "date"
                  ? (form[field.name] ? form[field.name].slice(0, 10) : "-")
                  : (form[field.name] || "-")}
              </span>
            </div>
          ))}
          <button
            className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition w-full"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;