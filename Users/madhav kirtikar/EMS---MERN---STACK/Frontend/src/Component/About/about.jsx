 import React from "react";

const AboutUs = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 px-4 py-12">
    <div className="bg-white/90 rounded-3xl shadow-2xl max-w-2xl w-full p-10 border border-blue-200 text-center relative overflow-hidden">
      {/* Decorative Gradient Circle */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-purple-300 via-blue-200 to-green-200 rounded-full opacity-30 z-0"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tr from-green-200 via-blue-200 to-purple-200 rounded-full opacity-30 z-0"></div>
      {/* Logo or Icon */}
      <div className="flex justify-center mb-4 z-10 relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-green-300 flex items-center justify-center shadow-lg border-4 border-white">
          <span className="text-4xl font-extrabold text-white drop-shadow-lg">MK</span>
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-green-700 mb-4 tracking-tight z-10 relative">
        About MyKorperate
      </h1>
      <p className="text-gray-700 text-lg mb-8 z-10 relative">
        MyKorperate is a modern web application designed to simplify and streamline employee management for organizations of all sizes.
      </p>
      <div className="mb-8 z-10 relative">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Our Mission</h2>
        <p className="text-gray-600">
          To provide an easy, efficient, and user-friendly platform for managing employees, departments, leaves, salaries, and more.
        </p>
      </div>
      <div className="mb-8 z-10 relative">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Key Features</h2>
        <ul className="text-gray-700 text-left list-disc list-inside mx-auto max-w-md mb-2 space-y-1">
          <li><span className="font-semibold text-blue-700">Employee profile management</span></li>
          <li><span className="font-semibold text-blue-700">Department creation and assignment</span></li>
          <li><span className="font-semibold text-blue-700">Leave application &amp; approval workflow</span></li>
          <li><span className="font-semibold text-blue-700">Salary management &amp; reports</span></li>
          <li><span className="font-semibold text-blue-700">Attendance tracking</span></li>
          <li><span className="font-semibold text-blue-700">Admin dashboard with analytics</span></li>
          <li><span className="font-semibold text-blue-700">Secure login &amp; role-based access</span></li>
          <li><span className="font-semibold text-blue-700">Responsive &amp; easy-to-use interface</span></li>
        </ul>
      </div>
      <div className="mb-8 z-10 relative">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Who We Are</h2>
        <p className="text-gray-600">
          We are a passionate team of developers dedicated to building robust and scalable solutions for real-world problems.
        </p>
      </div>
      <div className="z-10 relative">
        <span className="font-semibold text-blue-800 text-lg">Thank you for visiting!</span>
      </div>
    </div>
  </div>
);

export default AboutUs;