import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const EmployeeChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat/conversation", {
        headers,
      });
      if (response.data.success) setMessages(response.data.messages || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/send",
        { message },
        { headers }
      );
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.message]);
        setMessage("");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading chat...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded shadow overflow-hidden">
      <div className="p-5 border-b bg-green-700 text-white">
        <h2 className="text-2xl font-bold">Chat With Admin</h2>
        <p className="text-sm text-green-100">
          Ask questions about salary, attendance, leave, or profile details.
        </p>
      </div>

      <div className="h-[520px] overflow-y-auto p-5 bg-gray-50 space-y-3">
        {messages.length > 0 ? (
          messages.map((chat) => {
            const isMine = chat.senderId?._id === user._id || chat.senderRole === "employee";
            return (
              <div
                key={chat._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 shadow-sm ${
                    isMine ? "bg-green-600 text-white" : "bg-white text-gray-800 border"
                  }`}
                >
                  <p className="text-sm">{chat.message}</p>
                  <p className={`mt-1 text-xs ${isMine ? "text-green-100" : "text-gray-400"}`}>
                    {chat.senderId?.name || chat.senderRole} ·{" "}
                    {new Date(chat.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-20">
            No messages yet. Start a conversation with admin.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your query..."
        />
        <button
          type="submit"
          disabled={sending}
          className="px-5 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeChat;
