 import React from "react";
import dark_arrow from "../../assets/dark-arrow.png";
import heroImg from "../../assets/hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="w-full h-screen flex items-center justify-center text-white"
      style={{
        background: `linear-gradient(rgba(8,0,58,0.7),rgba(8,0,58,0.7)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="text-center max-w-[800px]">
        <h1 className="text-[60px] font-semibold">We Ensure To Manage Your Employees With Ease And Smartness</h1>
        <p className="max-w-[700px] mx-auto my-2.5 leading-relaxed">
           We make it easy to manage your employees by using smart, simple tools that save you time and hassle. You’ll have everything you need to keep your team organized, supported, and running smoothly.
        </p>
 
<li className="relative group">
  <button
    className="font-extrabold text-lg tracking-wide px-3 py-1 rounded transition-all duration-200 text-white hover:scale-110 hover:bg-white/20"
  >
    Explore More
  </button>
  <ul className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg hidden group-hover:block z-50">
    <li>
      <Link to="/careers" className="block px-4 py-2 text-gray-700 hover:bg-purple-100">Careers</Link>
    </li>
    <li>
      <Link to="/blog" className="block px-4 py-2 text-gray-700 hover:bg-purple-100">Blog</Link>
    </li>
    <li className="px-4 py-2 text-gray-400 text-center">More Coming Soon</li>
  </ul>
</li>
      </div>
    </div>
  );
};

export default Hero