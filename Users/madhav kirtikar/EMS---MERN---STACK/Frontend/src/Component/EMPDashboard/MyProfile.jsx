 import React, { useState, useEffect } from "react";

const MyProfile = ({ profile, setProfile }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);
  const [photoPreview, setPhotoPreview] = useState(profile.photo);

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

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(form);
    setEdit(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <img
          src={
            profile.photo
              ? profile.photo
              : `https://ui-avatars.com/api/?name=${profile.name}&background=8b5cf6&color=fff`
          }
          alt={profile.name}
          className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg mb-4 object-cover"
        />
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 bg-clip-text drop-shadow-lg mb-1 tracking-wide uppercase">
          {profile.name}
        </h2>
        <p className="text-lg font-semibold text-purple-700 bg-purple-100 px-4 py-1 rounded-full shadow-sm tracking-wider uppercase mt-6">
          {profile.position}
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
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={form.age || ""}
              onChange={handleChange}
              min="18"
              max="100"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate ? form.joiningDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
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
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Employee ID:</span>
            <span>{profile.employeeId || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Gender:</span>
            <span>{profile.gender || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Age:</span>
            <span>{profile.age || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Email:</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Phone:</span>
            <span>{profile.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Department:</span>
            <span>{profile.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Address:</span>
            <span>{profile.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Joining Date:</span>
            <span>{profile.joiningDate ? profile.joiningDate.slice(0, 10) : ""}</span>
          </div>
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