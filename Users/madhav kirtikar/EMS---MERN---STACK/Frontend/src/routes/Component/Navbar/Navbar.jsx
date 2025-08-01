 import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import searchIcon from '../../Assets/search-b.png';
import Chatbot from '../CGPT/Chatbot.jsx';

// Search data
const searchData = [
  { name: "Home", path: "/" },
  { name: "Login/Register", path: "/login" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contacts" },
  { name: "Leave", path: "/admin/leave" }
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("role"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || "";
    setIsLoggedIn(role === "admin" || role === "employee");
    setUserRole(role);
    setUserName(name);
    setMenuOpen(false);
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

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    navigate("/");
  };

  const getDisplayName = () => {
    if (userRole === "admin") return userName ? `Admin (${userName})` : "Admin";
    if (userRole === "employee") return userName ? `Employee (${userName})` : "Employee";
    return null;
  };

  return (
    <nav className="w-full shadow-lg bg-gradient-to-r from-cyan-700 via-blue-800 to-violet-700 px-2 md:px-6 py-3 flex items-center justify-between relative z-50 border-b-2 border-purple-800 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        
        <span
            className="select-none text-xl md:text-3xl font-black tracking-[0.20em]"
          style={{
            fontFamily: "'Quicksand', 'Montserrat', 'Segoe UI', Arial, sans-serif",
            letterSpacing: "0.20em",
            textShadow: "0 2px 12px #0007, 0 1px 0 #fff8",
            lineHeight: 1.1,
            background: "linear-gradient(90deg,#fffbe7 10%,#ffe082 30%,#ffd54f 50%,#ffb300 80%,#fffde4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            borderRadius: "8px",
            padding: "0 10px"
          }}
        >
          <span className="inline-block animate-bounce drop-shadow-lg">M</span>
          <span className="font-extrabold italic">y</span>
          <span className="inline-block animate-pulse drop-shadow-lg">K</span>
          <span className="font-extrabold italic">orperate</span>
        </span>
      </div>

      {/* Hamburger for mobile */}
      <button
        className="md:hidden ml-auto text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      {/* Main nav links */}
      <ul className={`flex-col md:flex-row flex gap-2 md:gap-6 list-none justify-center flex-1 p-0 m-0
        absolute md:static top-16 left-0 w-full md:w-auto bg-gradient-to-r from-blue-800 to-purple-800 md:bg-none transition-all duration-300
        ${menuOpen ? "flex" : "hidden md:flex"}
      `}>
        <li>
          <Link to="/" className="font-bold text-base md:text-lg tracking-wide px-3 py-2 rounded transition-all duration-200 text-white hover:scale-105 hover:bg-white/10 block">
            Home
          </Link>
        </li>
        <li>
          <Link to="/login" className="font-bold text-base md:text-lg tracking-wide px-3 py-2 rounded transition-all duration-200 text-white hover:scale-105 hover:bg-white/10 block">
            Login/Register
          </Link>
        </li>
        <li>
          <Link to="/about" className="font-bold text-base md:text-lg tracking-wide px-3 py-2 rounded transition-all duration-200 text-white hover:scale-105 hover:bg-white/10 block">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="font-bold text-base md:text-lg tracking-wide px-3 py-2 rounded transition-all duration-200 text-white hover:scale-105 hover:bg-white/10 block">
            Contact Us
          </Link>
        </li>
        {isLoggedIn && (
          <li>
            <button
              onClick={handleLogout}
              className="font-bold text-base md:text-lg tracking-wide px-3 py-2 rounded transition-all duration-200 text-white hover:scale-105 hover:bg-white/10 block"
            >
              Logout
            </button>
          </li>
        )}
        {/* Show user name on mobile */}
        {isLoggedIn && (
          <li className="md:hidden">
            <span className="font-bold text-white px-3 py-2 block">{getDisplayName()}</span>
          </li>
        )}
      </ul>

         {/* Search and user info (desktop only) */}
      <div className="hidden md:flex items-center ml-4 flex-shrink-0 relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(results.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Search..."
          className="px-5 py-2 rounded-full border-none outline-none bg-white/90 text-black font-semibold shadow focus:ring-2 focus:ring-purple-400 transition w-56 md:w-72 pr-12 text-base border-2 border-purple-200 focus:border-blue-400"
          style={{ boxShadow: "0 2px 8px 0 rgba(139,92,246,0.15)" }}
        />
        <img
          src={searchIcon}
          alt="search"
          className="absolute right-4 w-7 h-7 cursor-pointer"
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
        {/* User name (desktop only) */}
        {isLoggedIn && (
          <span className="ml-6 font-bold text-white text-lg">{getDisplayName()}</span>
        )}
      </div>

      {/* Chatbot Button (always visible, right aligned) */}
      <div className="hidden md:flex items-center ml-16">
        <button
          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-gray-900 font-bold px-6 py-2 rounded-2xl shadow-xl border-2 border-white/30 hover:from-yellow-300 hover:to-pink-400 transition text-base tracking-wide"
          onClick={() => setChatOpen(true)}
          style={{
            letterSpacing: "0.08em",
            fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif"
          }}
        >
          <span className="mr-2">🤖</span>Ask to C-GPT
        </button>
      </div>
      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </nav>
  );
};

export default Navbar;