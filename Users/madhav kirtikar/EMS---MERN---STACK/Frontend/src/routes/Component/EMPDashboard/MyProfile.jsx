import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Dummy data for fallback/testing
const USE_DUMMY = true; // true: dummy data, false: backend data

const DUMMY_PROFILE = {
  name: "Employee Name",
  email: "emp@demo.com",
  phone: "9876543210",
  gender: "Male",
  age: 28,
  department: "Development",
  position: "Software Engineer",
  address: "Mumbai, India",
  joiningDate: "2022-01-10",
  salary: 50000,
  photo: "",
  empId: "EMP123456"
};

const MyProfile = ({ profile, setProfile }) => {
  const [form, setForm] = useState(profile);
  const [photoPreview, setPhotoPreview] = useState(localStorage.getItem("profile") || "");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For ID Card Download
  const [showIdCard, setShowIdCard] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const idCardRef = useRef(null);

  // Fetch profile from backend or dummy on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (USE_DUMMY) {
        setProfile(DUMMY_PROFILE);
        setForm(DUMMY_PROFILE);
        setPhotoPreview(DUMMY_PROFILE.photo);
        setLoading(false);
        return;
      }
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
  const interval = setInterval(() => {
    const latestProfile = localStorage.getItem("profile") || "";
    setPhotoPreview(latestProfile);
  }, 500);

  return () => clearInterval(interval);
}, []);

  const adminFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Gender", name: "gender", type: "text" },
    { label: "Age", name: "age", type: "number" },
    { label: "Department", name: "department", type: "text" },
    { label: "Position", name: "position", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Joining Date", name: "joiningDate", type: "date" },
    { label: "Salary", name: "salary", type: "number" }
  ];

  // ID Card Download Handler
  const handleDownloadIdCard = () => {
    setShowLoginModal(true);
    setLoginInfo({ email: "", password: "" });
    setLoginError("");
  };

  // Login check before download (dummy or backend)
  const handleLoginAndDownload = async (e) => {
    e.preventDefault();
    setLoginError("");
    setDownloading(true);

    // Dummy check
    if (USE_DUMMY) {
      if (
        loginInfo.email === form.email &&
        (loginInfo.password === "password" || loginInfo.password === "123456")
      ) {
        setShowLoginModal(false);
        setDownloading(false);
        setTimeout(() => downloadIdCardImage(), 300);
        return;
      } else {
        setLoginError("Invalid email or password.");
        setDownloading(false);
        return;
      }
    }

    // Backend check
    try {
      const res = await axios.post("/api/employee/login", {
        email: loginInfo.email,
        password: loginInfo.password
      });
      if (res.data && res.data.token) {
        setShowLoginModal(false);
        setDownloading(false);
        setTimeout(() => downloadIdCardImage(), 300);
      } else {
        setLoginError("Invalid login details.");
        setDownloading(false);
      }
    } catch {
      setLoginError("Invalid login details.");
      setDownloading(false);
    }
  };

  // Download ID Card as image
  const downloadIdCardImage = async () => {
    if (!idCardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    html2canvas(idCardRef.current, {
      backgroundColor: null,
      scale: 3 // For HD/4K quality
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${form.name || "employee"}-idcard.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-xl py-20">
        Loading profile...
      </div>
    );
  }

  // Modern animated completeness meter
  const completeness = Math.round((Object.values(form).filter(Boolean).length / Object.keys(DUMMY_PROFILE).length) * 100);

  // Find missing fields for completeness
  const missingFields = Object.keys(DUMMY_PROFILE).filter(
    key => !form[key]
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-10 p-4">
      {/* Unified Profile + ID Card Section */}
      <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-8 items-center justify-center relative">
        {/* Profile Card */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt={form.name}
                className="w-28 h-28 rounded-full border-4 border-indigo-300 shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold uppercase border-4 border-indigo-300 shadow-lg select-none">
                {form.name?.charAt(0) || "E"}
              </div>
            )}
            <span className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs shadow select-none">
              Profile
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-1">{form.name}</h2>
          <p className="text-lg font-semibold text-indigo-700 mb-1">{form.position}</p>
          <p className="text-sm text-gray-700 mb-2">Employee ID: <span className="font-bold text-indigo-700">{form.empId}</span></p>
          {/* Modern completeness meter */}
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full transition-all duration-700" style={{ width: `${completeness}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                Profile completeness: {completeness}%
              </div>
            </div>
            {/* Show missing fields if not 100% */}
            {completeness < 100 && (
              <div className="mt-2 text-xs text-red-600 font-semibold text-center">
                Missing: {missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(", ")}
              </div>
            )}
          </div>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold shadow hover:bg-indigo-700 transition" onClick={() => navigate('/emp/settings')}>
            Update Profile
          </button>
          {/* Key Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow">
              <h4 className="text-xs text-indigo-700 font-bold">Department</h4>
              <p className="text-lg font-semibold text-indigo-900">{form.department}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow">
              <h4 className="text-xs text-blue-700 font-bold">Position</h4>
              <p className="text-lg font-semibold text-blue-900">{form.position}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Virtual ID Card Section - moved below profile info */}
      <div className="mt-8 flex flex-col items-center justify-center">
        {/* Step 1: Show only "Virtual ID Card" button */}
        {!showIdCard && (
          <button
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg text-xl tracking-wider hover:bg-indigo-700 transition mb-4"
            onClick={() => setShowIdCard(true)}
          >
            Virtual ID Card
          </button>
        )}

        {/* Step 2: Show ID Card and Download/Hide buttons */}
        {showIdCard && (
          <div className="w-full flex flex-col items-center justify-center">
            <div
              ref={idCardRef}
              className="w-80 h-52 bg-gradient-to-br from-indigo-700 via-indigo-500 to-indigo-400 rounded-2xl shadow-2xl border-4 border-white relative overflow-hidden flex flex-row items-center px-5 py-4 mt-2 mb-4"
              style={{
                fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
                minWidth: 320,
                minHeight: 200,
                maxWidth: 340
              }}
            >
              {/* Left: Photo */}
              <div className="flex flex-col items-center justify-between mr-4 h-full">
  {photoPreview ? (
    <img
      src={photoPreview}
      alt={form.name}
      className="w-20 h-20 rounded-full border-2 border-white shadow-lg object-cover bg-white"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold uppercase border-2 border-white shadow-lg select-none">
      
      {form.name?.charAt(0) || "E"}
    </div>
  )}
  <span className="text-xs font-bold text-white bg-indigo-700 px-2 py-0.5 rounded-full shadow mb-2">
    {form.empId || "EMPID"}
  </span>
</div>
              {/* Right: Details */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-1 tracking-wider uppercase drop-shadow">
                  {form.name}
                </h3>
                <p className="text-sm text-indigo-100 font-semibold mb-1">{form.position}</p>
                <p className="text-xs text-white mb-1">
                  <span className="font-bold">Dept:</span> {form.department}
                </p>
                <p className="text-xs text-white mb-1">
                  <span className="font-bold">Email:</span> {form.email}
                </p>
                <p className="text-xs text-white mb-1">
                  <span className="font-bold">Phone:</span> {form.phone}
                </p>
                <p className="text-xs text-white">
                  <span className="font-bold">Join:</span>{" "}
                  {form.joiningDate ? form.joiningDate.slice(0, 10) : "-"}
                </p>
              </div>
              {/* Company Logo or QR (optional) */}
              <div className="absolute bottom-2 right-2">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="#fff" fillOpacity="0.18" />
                  <text x="50%" y="58%" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" dy=".3em">ID</text>
                </svg>
              </div>
            </div>
            <button
              className="mt-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition text-lg tracking-wider w-full md:w-auto"
              onClick={handleDownloadIdCard}
            >
              Download Virtual ID Card
            </button>
            <button
              className="mt-2 px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-full shadow hover:bg-gray-300 transition text-lg tracking-wider w-full md:w-auto"
              onClick={() => setShowIdCard(false)}
            >
              Hide
            </button>
          </div>
        )}

        {/* Modal for login info before download */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xs">
              <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">Verify to Download</h3>
              <form onSubmit={handleLoginAndDownload} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={loginInfo.email}
                    onChange={e => setLoginInfo({ ...loginInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={loginInfo.password}
                    onChange={e => setLoginInfo({ ...loginInfo, password: e.target.value })}
                  />
                </div>
                {loginError && (
                  <div className="text-red-500 text-sm text-center">{loginError}</div>
                )}
                <button
                  type="submit"
                  disabled={downloading}
                  className="w-full mt-2 py-2 bg-indigo-600 text-white font-bold rounded-full shadow hover:bg-indigo-700 transition"
                >
                  {downloading ? "Verifying..." : "Verify & Download"}
                </button>
                <button
                  type="button"
                  className="w-full mt-2 py-2 bg-gray-200 text-gray-700 font-bold rounded-full shadow hover:bg-gray-300 transition"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Employee Information Table below unified card and ID card */}
      <div className="mt-8 bg-white/80 rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2 text-center">Employee Information</h3>
        <table className="w-full max-w-xl border-separate border-spacing-y-1 mx-auto">
          <tbody>
            {adminFields.map((field) => (
              <tr key={field.name} className="text-center">
                <td className="py-1 px-2 font-semibold text-gray-600 text-right w-40 text-center">
                  {field.label}:
                </td>
                <td className="py-1 px-2 text-gray-800 text-left text-center">
                  {field.type === "date"
                    ? (form[field.name] ? form[field.name].slice(0, 10) : "-")
                    : (form[field.name] || "-")}
                </td>
              </tr>
            ))}
            <tr className="text-center">
              <td className="py-1 px-2 font-semibold text-gray-600 text-right w-40 text-center">
                Employee ID:
              </td>
              <td className="py-1 px-2 text-gray-800 text-left text-center">
                {form.empId || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProfile;