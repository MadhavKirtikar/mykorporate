 import React from "react";

const SplashScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-400 overflow-hidden">
    {/* Animated rotating ring */}
    <div className="absolute">
      <svg width="220" height="220" viewBox="0 0 220 220" className="animate-spin-slow">
        <circle
          cx="110"
          cy="110"
          r="90"
          stroke="url(#ringGrad)"
          strokeWidth="18"
          fill="none"
          strokeDasharray="40 20"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    {/* Logo and text */}
    <div className="flex flex-col items-center relative z-10">
      <span className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg animate-bounce mb-2">
        <span className="text-yellow-300 animate-pop">M</span>
        y
        <span className="text-yellow-300 animate-pop-delay">K</span>
        orperate
      </span>
      <span className="text-xl text-white/80 animate-pulse tracking-widest animate-fadein">Welcome...</span>
    </div>
    {/* Extra sparkles */}
    <div className="absolute left-1/3 top-1/4 animate-sparkle">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="3" fill="#facc15" opacity="0.8" />
      </svg>
    </div>
    <div className="absolute right-1/4 bottom-1/3 animate-sparkle-delay">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2" fill="#a78bfa" opacity="0.7" />
      </svg>
    </div>
    {/* Styles */}
    <style>{`
      .animate-spin-slow {
        animation: spin 2.8s linear infinite;
      }
      @keyframes spin {
        100% { transform: rotate(360deg);}
      }
      .animate-pop {
        animation: pop 0.7s cubic-bezier(.7,0,.3,1) both;
      }
      .animate-pop-delay {
        animation: pop 0.7s 0.3s cubic-bezier(.7,0,.3,1) both;
      }
      @keyframes pop {
        0% { transform: scale(0.5); opacity: 0;}
        60% { transform: scale(1.2);}
        100% { transform: scale(1); opacity: 1;}
      }
      .animate-fadein {
        animation: fadein 1.2s 0.7s cubic-bezier(.7,0,.3,1) both;
      }
      @keyframes fadein {
        0% { opacity: 0; transform: translateY(20px);}
        100% { opacity: 1; transform: translateY(0);}
      }
      .animate-sparkle {
        animation: sparkle 1.6s infinite alternate;
      }
      .animate-sparkle-delay {
        animation: sparkle 1.6s 0.8s infinite alternate;
      }
      @keyframes sparkle {
        0% { opacity: 0.2; transform: scale(0.7);}
        60% { opacity: 1; transform: scale(1.2);}
        100% { opacity: 0.5; transform: scale(1);}
      }
    `}</style>
  </div>
);

export default SplashScreen;