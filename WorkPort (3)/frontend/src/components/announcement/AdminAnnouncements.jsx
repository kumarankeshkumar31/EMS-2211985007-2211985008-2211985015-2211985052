import React, { useEffect, useState } from "react";
import axios from "axios";

const priorityClasses = {
  Normal: "bg-blue-100 text-blue-700",
  Important: "bg-yellow-100 text-yellow-700",
  Urgent: "bg-red-100 text-red-700",
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "Normal",
  });

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/announcement", {
        headers,
      });
      if (response.data.success) setAnnouncements(response.data.announcements || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/announcement", form, {
        headers,
      });
      if (response.data.success) {
        setForm({ title: "", message: "", priority: "Normal" });
        fetchAnnouncements();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/announcement/${id}`, {
        headers,
      });
      if (response.data.success) fetchAnnouncements();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete announcement");
    }
  };

  if (loading) return <div className="text-center py-10">Loading announcements...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-2xl font-bold text-gray-700 mb-1">Create Announcement</h3>
        <p className="text-sm text-gray-500 mb-6">
          Share official notices with every employee.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Example: Holiday Notice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none resize-none focus:ring-2 focus:ring-green-500"
              rows="6"
              placeholder="Write announcement details..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Publish Announcement
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-700">Announcement Board</h3>
          <p className="text-sm text-gray-500">Latest notices visible to employees.</p>
        </div>

        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        priorityClasses[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                    <h4 className="mt-2 text-lg font-bold text-gray-800">{item.title}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-3 text-gray-600 whitespace-pre-line">{item.message}</p>
                <p className="mt-3 text-xs text-gray-400">
                  Posted by {item.createdBy?.name || "Admin"} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">No announcements yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
