import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const AdminChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/chat/admin/conversations",
        { headers }
      );
      if (response.data.success) {
        setConversations(response.data.conversations || []);
        if (!selectedEmployee && response.data.conversations?.length) {
          setSelectedEmployee(response.data.conversations[0].employee);
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (employeeUserId) => {
    if (!employeeUserId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/conversation/${employeeUserId}`,
        { headers }
      );
      if (response.data.success) setMessages(response.data.messages || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load chat");
    }
  };

  useEffect(() => {
    fetchConversations();
    const timer = setInterval(fetchConversations, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const employeeUserId = selectedEmployee?.userId?._id;
    fetchMessages(employeeUserId);
    if (!employeeUserId) return;
    const timer = setInterval(() => fetchMessages(employeeUserId), 5000);
    return () => clearInterval(timer);
  }, [selectedEmployee?.userId?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const query = search.toLowerCase();
    return conversations.filter(({ employee }) => {
      return (
        !query ||
        employee?.employeeId?.toLowerCase().includes(query) ||
        employee?.userId?.name?.toLowerCase().includes(query) ||
        employee?.department?.dep_name?.toLowerCase().includes(query)
      );
    });
  }, [conversations, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeUserId = selectedEmployee?.userId?._id;
    if (!message.trim() || !employeeUserId) return;
    setSending(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/send",
        { message, employeeUserId },
        { headers }
      );
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.message]);
        setMessage("");
        fetchConversations();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading chat...</div>;

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="text-2xl font-bold text-gray-700">Employee Queries</h3>
        <p className="text-sm text-gray-500">
          Open any employee thread and reply to their questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-[620px]">
        <aside className="border-r bg-gray-50">
          <div className="p-4 border-b">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search employee..."
            />
          </div>

          <div className="h-[560px] overflow-y-auto">
            {filteredConversations.map(({ employee, latestMessage, messageCount }) => (
              <button
                key={employee._id}
                type="button"
                onClick={() => setSelectedEmployee(employee)}
                className={`w-full p-4 text-left border-b hover:bg-white ${
                  selectedEmployee?._id === employee._id ? "bg-white border-l-4 border-l-green-600" : ""
                }`}
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{employee.userId?.name}</p>
                    <p className="text-xs text-gray-500">
                      {employee.employeeId} · {employee.department?.dep_name || "N/A"}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-1 h-fit">
                    {messageCount}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 truncate">
                  {latestMessage?.message || "No messages yet"}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-col">
          {selectedEmployee ? (
            <>
              <div className="p-4 border-b bg-green-700 text-white">
                <h4 className="font-bold text-lg">{selectedEmployee.userId?.name}</h4>
                <p className="text-sm text-green-100">
                  {selectedEmployee.employeeId} · {selectedEmployee.designation || "Employee"} ·{" "}
                  {selectedEmployee.department?.dep_name || "Department"}
                </p>
              </div>

              <div className="flex-1 h-[480px] overflow-y-auto p-5 bg-gray-50 space-y-3">
                {messages.length > 0 ? (
                  messages.map((chat) => {
                    const isMine = chat.senderId?._id === user._id || chat.senderRole === "admin";
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
                    No conversation yet. Send the first message.
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Reply to employee..."
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select an employee to open chat.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminChat;
