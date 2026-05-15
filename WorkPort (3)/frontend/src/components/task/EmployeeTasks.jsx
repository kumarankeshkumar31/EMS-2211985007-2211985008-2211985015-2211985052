import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const statusClass = {
  Assigned: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Submitted: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  "Revision Requested": "bg-red-100 text-red-700",
};

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportNotes, setReportNotes] = useState({});
  const [reportFiles, setReportFiles] = useState({});

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/task/my", { headers });
      if (response.data.success) setTasks(response.data.tasks || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    return tasks.reduce(
      (taskStats, task) => {
        taskStats[task.status] = (taskStats[task.status] || 0) + 1;
        return taskStats;
      },
      { Assigned: 0, "In Progress": 0, Submitted: 0, Completed: 0, "Revision Requested": 0 }
    );
  }, [tasks]);

  const handleStart = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/${taskId}/progress`,
        {},
        { headers }
      );
      if (response.data.success) fetchTasks();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update task");
    }
  };

  const handleSubmitReport = async (taskId) => {
    const file = reportFiles[taskId];
    if (!file) {
      alert("Please choose a report file");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);
    formData.append("reportNote", reportNotes[taskId] || "");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/task/${taskId}/submit`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setReportFiles((prev) => ({ ...prev, [taskId]: null }));
        setReportNotes((prev) => ({ ...prev, [taskId]: "" }));
        fetchTasks();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to submit report");
    }
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <p className="text-sm text-gray-500">
          Start assigned work, upload your report, and wait for admin review.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-5">
        {Object.keys(stats).map((status) => (
          <div key={status} className="rounded bg-gray-50 border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">{status}</p>
            <h3 className="text-xl font-bold text-gray-800">{stats[status]}</h3>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Priority: {task.priority}
                    {task.dueDate && ` · Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusClass[task.status]
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="mt-3 text-gray-600">{task.description}</p>

              {task.reviewNote && (
                <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">
                  <span className="font-semibold">Admin Review:</span> {task.reviewNote}
                </p>
              )}

              {task.reportFile && (
                <a
                  href={`http://localhost:5000/${task.reportFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  View Submitted Report
                </a>
              )}

              <div className="mt-4">
                {["Assigned", "Revision Requested"].includes(task.status) && (
                  <button
                    type="button"
                    onClick={() => handleStart(task._id)}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Start Task
                  </button>
                )}

                {task.status === "In Progress" && (
                  <div className="space-y-3">
                    <textarea
                      value={reportNotes[task._id] || ""}
                      onChange={(e) =>
                        setReportNotes((prev) => ({ ...prev, [task._id]: e.target.value }))
                      }
                      rows="2"
                      className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Add report summary or completion note"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setReportFiles((prev) => ({ ...prev, [task._id]: e.target.files[0] }))
                      }
                      className="block w-full text-sm border border-gray-300 rounded p-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitReport(task._id)}
                      className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Submit Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">No tasks assigned yet.</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;
