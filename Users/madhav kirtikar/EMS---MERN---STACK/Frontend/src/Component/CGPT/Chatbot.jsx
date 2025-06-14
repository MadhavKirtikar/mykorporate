 import React, { useState, useRef, useEffect } from "react";
import { languages } from "../../utils/languages";
import { speak, listen } from "../../utils/voice";
import { sendMessage } from "../../utils/chatgpt";

export default function Chatbot({ open, setOpen }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 650 });
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ w: 420, h: 650 });
  const [resizing, setResizing] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const sizeOffset = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  // Detect role from localStorage
  const role = localStorage.getItem("role") || "employee";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging || moveMode) {
        setDrag({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
      if (resizing) {
        setSize({
          w: Math.max(320, Math.min(e.clientX - drag.x, window.innerWidth - drag.x - 10)),
          h: Math.max(400, Math.min(e.clientY - drag.y, window.innerHeight - drag.y - 10)),
        });
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      setMoveMode(false);
    };
    if (dragging || resizing || moveMode) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, moveMode, drag.x, drag.y]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input, lang: language }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await sendMessage(input, language, role);
      setMessages([...newMessages, { sender: "bot", text: response || "No reply received.", lang: language }]);
      speak(response, language);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "Sorry, I couldn't reply. Please try again.", lang: language }]);
    }
    setLoading(false);
  };

  const handleVoice = () => {
    setListening(true);
    listen(language, (text) => {
      setInput(text);
      setListening(false);
    });
  };

  const handleMouseDown = (e) => {
    if (!moveMode) {
      setDragging(true);
      offset.current = {
        x: e.clientX - drag.x,
        y: e.clientY - drag.y,
      };
    }
  };

  const handleDoubleClick = (e) => {
    setMoveMode(true);
    offset.current = {
      x: e.clientX - drag.x,
      y: e.clientY - drag.y,
    };
  };

  const handleResizeDown = (e) => {
    setResizing(true);
    sizeOffset.current = {
      x: e.clientX - size.w,
      y: e.clientY - size.h,
    };
    e.stopPropagation();
  };

  if (!open) return null;

  return (
    <div
      className="fixed z-[9999] bg-transparent"
      style={{
        left: Math.max(0, Math.min(drag.x, window.innerWidth - size.w)),
        top: Math.max(0, Math.min(drag.y, window.innerHeight - size.h)),
        width: size.w,
        height: size.h,
        maxWidth: "98vw",
        maxHeight: "98vh",
        overflow: "hidden",
        borderRadius: 24,
        boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)",
        background: "transparent"
      }}
    >
      {/* Header */}
      <div
        className="cursor-move bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white px-6 py-3 rounded-t-2xl flex justify-between items-center select-none shadow"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ fontFamily: "Inter, sans-serif" }}
        title="Double click to move from anywhere"
      >
        <span className="font-bold text-xl flex items-center gap-2 tracking-wide drop-shadow">🤖 C-GPT Chat</span>
        <button
          onClick={() => setOpen(false)}
          className="text-white text-2xl font-bold hover:bg-blue-800 hover:text-red-200 rounded-full w-9 h-9 flex items-center justify-center transition"
          aria-label="Close"
        >×</button>
      </div>
      {/* Main Body */}
      <div className="rounded-b-2xl shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-orange-50 h-full flex flex-col relative">
        {/* Language Selector */}
        <div className="flex items-center justify-between mb-2 px-6 pt-4">
          <select
            className="p-2 border-2 border-blue-200 rounded-lg bg-white font-semibold text-blue-700 focus:ring-2 focus:ring-blue-400 text-sm shadow"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        {/* Messages */}
        <div
          className="flex-1 h-0 overflow-y-auto p-4 rounded-xl bg-white/90 shadow-inner scrollbar-thin scrollbar-thumb-blue-200"
          style={{ marginBottom: "90px" }} // Space for input area
        >
          {messages.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-24 font-semibold text-base">Start the conversation...</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div className={`
                max-w-[80%] px-5 py-3 rounded-2xl shadow text-base
                ${msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-br-md"
                  : "bg-gradient-to-r from-orange-200 to-yellow-100 text-gray-800 rounded-bl-md flex items-center gap-2"}
              `}>
                {msg.sender === "bot" && <span className="text-xl mr-1">🤖</span>}
                <span style={{ wordBreak: "break-word" }}>{msg.text}</span>
                {msg.lang && msg.lang !== "en" && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{msg.lang.toUpperCase()}</span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="max-w-[80%] px-5 py-3 rounded-2xl shadow bg-gradient-to-r from-orange-200 to-yellow-100 text-gray-800 rounded-bl-md flex items-center gap-2 animate-pulse text-base">
                <span className="text-xl mr-1">🤖</span>
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div
          className="flex gap-2 px-6 pb-5 pt-3 overflow-hidden bg-white/95 rounded-b-2xl shadow-lg items-center"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <input
            type="text"
            className="flex-1 p-3 border-2 border-blue-200 rounded-full focus:ring-2 focus:ring-blue-400 font-semibold text-gray-700 shadow text-base bg-white outline-none"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            style={{ minWidth: 0 }}
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-3 rounded-full font-bold shadow hover:scale-105 transition text-base flex-shrink-0"
            style={{ minWidth: 70 }}
            aria-label="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Send
          </button>
          <button
            onClick={handleVoice}
            className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-full font-bold shadow hover:scale-105 transition flex items-center gap-2 text-base flex-shrink-0 ${listening ? "animate-pulse" : ""}`}
            style={{ minWidth: 48 }}
            aria-label="Mic"
          >
            {listening ? (
              <>
                <span className="animate-bounce">🎤</span>
                Listening...
              </>
            ) : (
              <span className="text-xl">🎤</span>
            )}
          </button>
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeDown}
            className="ml-2 w-8 h-8 flex items-center justify-center cursor-se-resize z-50 bg-white border-2 border-blue-300 shadow-lg"
            style={{
              borderRadius: 8,
              opacity: 0.85,
              transition: "background 0.2s",
              position: "static"
            }}
            title="Resize"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L16 4M8 16H16V8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}