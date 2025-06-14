 import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import searchIcon from '../../Assets/search-b.png';
import Chatbot from '../CGPT/Chatbot.jsx';

const searchData = [
  { name: "Home", path: "/" },
  { name: "Login/Register", path: "/login" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contacts" },
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Employees", path: "/admin/employees" },
  { name: "Departments", path: "/admin/departments" },
  { name: "Salary", path: "/admin/salary" },
  { name: "Leave", path: "/admin/leave" },
  { name: "Settings", path: "/admin/settings" },
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("role"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsLoggedIn(role === "admin" || role === "employee");
  }, [location.pathname]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = searchData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelect = (path) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    navigate(path);
  };

  // Optional: Logout button for demo (remove if not needed)
  const handleLogout = () => {
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-8 py-3 m-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="flex items-center">
        <span className="text-2xl font-extrabold tracking-widest drop-shadow-lg text-white">
          MyKorperate
        </span>
      </div>
      <ul className="flex gap-8 list-none justify-center flex-1 p-0 m-0">
        <li>
          <Link to="/" className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20">Home</Link>
        </li>
        {!isLoggedIn && (
          <li>
            <Link to="/login" className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20">Login/Register</Link>
          </li>
        )}
        <li>
          <Link to="/about" className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20">About Us</Link>
        </li>
        <li>
          <Link to="/contacts" className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20">Contact Us</Link>
        </li>
        {/* Optional: Show logout button if logged in */}
        {isLoggedIn && (
          <li>
            <button
              onClick={handleLogout}
              className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
      <div className="mx-4 flex items-center flex-shrink-0 relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(results.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Search..."
          className="px-4 py-2 rounded-full border-none outline-none bg-white/80 text-black-700 font-semibold shadow focus:ring-2 focus:ring-purple-400 transition w-48 md:w-64 pr-10"
          style={{ boxShadow: "0 2px 8px 0 rgba(139,92,246,0.15)" }}
        />
        <img
          src={searchIcon}
          alt="search"
          className="absolute right-3 w-6 h-6 cursor-pointer"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
        {showDropdown && (
          <ul className="absolute left-0 top-12 w-full bg-white rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto border border-purple-200 animate-fadeIn">
            {results.length === 0 && (
              <li className="px-4 py-3 text-gray-400 text-center font-semibold tracking-wide">No results found</li>
            )}
            {results.map((item, idx) => (
              <li
                key={item.path}
                className={`px-5 py-3 flex items-center gap-2 cursor-pointer transition-all duration-150
                  ${idx % 2 === 0 ? "bg-purple-50" : "bg-white"}
                  hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-purple-700 font-semibold rounded`}
                onMouseDown={() => handleSelect(item.path)}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                <span className="tracking-wide">{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition ml-4"
        onClick={() => setChatOpen(true)}
      >
        Ask to C-GPT
      </button>
      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </nav>
  );
};

export default Navbar;