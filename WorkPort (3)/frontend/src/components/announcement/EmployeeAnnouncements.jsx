import React, { useEffect, useState } from "react";
import axios from "axios";

const priorityClasses = {
  Normal: "bg-blue-100 text-blue-700",
  Important: "bg-yellow-100 text-yellow-700",
  Urgent: "bg-red-100 text-red-700",
};

const EmployeeAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcement", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) setAnnouncements(response.data.announcements || []);
      } catch (error) {
        alert(error.response?.data?.error || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <div className="text-center py-10">Loading announcements...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded shadow p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Company Announcements</h2>
        <p className="text-sm text-gray-500">Official notices from admin.</p>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-5">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  priorityClasses[item.priority]
                }`}
              >
                {item.priority}
              </span>
              <h3 className="mt-3 text-xl font-bold text-gray-800">{item.title}</h3>
              <p className="mt-3 text-gray-600 whitespace-pre-line">{item.message}</p>
              <p className="mt-4 text-xs text-gray-400">
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
  );
};

export default EmployeeAnnouncements;
