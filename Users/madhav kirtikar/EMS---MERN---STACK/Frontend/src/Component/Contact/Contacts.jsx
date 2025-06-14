 import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await emailjs.send(
        "service_phnxf5a",
        "template_ih7yttq",
        {
          name: form.name,
          email: form.email,
          title: form.title,
          message: form.message,
        },
        "olxpiXJL5MYX3SpSH"
      );
      setSubmitted(true);
      setForm({ name: "", email: "", title: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-xl w-full bg-white/80 rounded-3xl shadow-2xl border border-blue-100 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-8">
          Have a question, suggestion, or want to connect? Fill out the form below and our team will get back to you soon!
        </p>

        {submitted ? (
          <div className="text-green-600 text-center font-semibold py-10 flex flex-col items-center gap-6">
            <div>
              Thank you for reaching out!<br />We will get back to you soon.
            </div>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => setSubmitted(false)}
            >
              Back
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="px-4 py-3 rounded-lg border border-blue-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="px-4 py-3 rounded-lg border border-blue-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="px-4 py-3 rounded-lg border border-blue-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="px-4 py-3 rounded-lg border border-blue-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none"
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-400 text-white py-3 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-green-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <div className="mt-10 text-center text-gray-500 text-sm">
          Or email us directly at <a href="mailto:saamibook@gmail.com" className="text-blue-600 underline">saamibook@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;