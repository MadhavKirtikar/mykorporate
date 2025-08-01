 import axios from "axios";

export async function sendMessage(message, language, role) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "/api/chatgpt",
    { message, language, role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.answer;
}