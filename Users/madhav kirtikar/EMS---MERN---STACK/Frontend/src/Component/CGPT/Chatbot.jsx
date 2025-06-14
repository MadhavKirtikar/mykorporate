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
  const [drag, setDrag] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 500 });
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ w: 340, h: 420 });
  const [resizing, setResizing] = useState(false);
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
      if (dragging) {
        setDrag({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
      if (resizing) {
        setSize({
          w: Math.max(260, Math.min(e.clientX - drag.x, window.innerWidth - drag.x - 10)),
          h: Math.max(250, Math.min(e.clientY - drag.y, window.innerHeight - drag.y - 10)),
        });
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };
    if (dragging || resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, drag.x, drag.y]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await sendMessage(input, language, role);
      setMessages([...newMessages, { sender: "bot", text: response || "No reply received." }]);
      speak(response, language);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "Sorry, I couldn't reply. Please try again." }]);
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
    setDragging(true);
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
        borderRadius: 20,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        background: "transparent"
      }}
    >
      <div
        className="cursor-move bg-blue-700 text-white px-4 py-2 rounded-t-xl flex justify-between items-center select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="font-bold text-lg flex items-center gap-2">🤖 Ask to C-GPT</span>
        <button onClick={() => setOpen(false)} className="text-white text-xl font-bold">×</button>
      </div>
      <div className="rounded-b-xl shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-orange-50 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 px-4 pt-2">
          <select
            className="p-2 border-2 border-blue-200 rounded-lg bg-white font-semibold text-blue-700 focus:ring-2 focus:ring-blue-400 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 h-0 overflow-y-auto p-3 rounded-xl bg-white/80 shadow-inner scrollbar-thin scrollbar-thumb-blue-200">
          {messages.length === 0 && !loading && (
            <div className="text-center text-gray-400 mt-16 font-semibold text-base">Start the conversation...</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div className={`
                max-w-[80%] px-4 py-2 rounded-xl shadow text-sm
                ${msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-br-none"
                  : "bg-gradient-to-r from-orange-200 to-yellow-100 text-gray-800 rounded-bl-none flex items-center gap-2"}
              `}>
                {msg.sender === "bot" && <span className="text-xl mr-1">🤖</span>}
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-2">
              <div className="max-w-[80%] px-4 py-2 rounded-xl shadow bg-gradient-to-r from-orange-200 to-yellow-100 text-gray-800 rounded-bl-none flex items-center gap-2 animate-pulse text-sm">
                <span className="text-xl mr-1">🤖</span>
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 mt-3 px-4 pb-4 overflow-hidden">
          <input
            type="text"
            className="flex-1 p-2 border-2 border-blue-200 rounded-full focus:ring-2 focus:ring-blue-400 font-semibold text-gray-700 shadow text-sm"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition text-sm"
          >
            Send
          </button>
          <button
            onClick={handleVoice}
            className={`bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-2 rounded-full font-bold shadow hover:scale-105 transition flex items-center gap-2 text-sm ${listening ? "animate-pulse" : ""}`}
          >
            {listening ? (
              <>
                <span className="animate-bounce">🎤</span>
                Listening...
              </>
            ) : (
              <span>🎤</span>
            )}
          </button>
        </div>
        {/* Resize handle */}
        <div
          onMouseDown={handleResizeDown}
          className="absolute right-2 bottom-2 w-5 h-5 cursor-se-resize z-50"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 60%, #f59e42 100%)",
            borderRadius: 4,
            opacity: 0.7,
          }}
          title="Resize"
        />
      </div>
    </div>
  );
}