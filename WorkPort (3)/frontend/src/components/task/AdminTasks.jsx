import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const statusClass = {
  Assigned: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Submitted: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  "Revision Requested": "bg-red-100 text-red-700",
};

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    employeeId: "",
    priority: "Medium",
    dueDate: "",
  });
  const [reviewNotes, setReviewNotes] = useState({});

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchData = async () => {
    try {
      const [taskRes, empRes] = await Promise.all([
        axios.get("http://localhost:5000/api/task", { headers }),
        axios.get("http://localhost:5000/api/employee", { headers }),
      ]);

      if (taskRes.data.success) setTasks(taskRes.data.tasks || []);
      if (empRes.data.success) setEmployees(empRes.data.employees || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      setForm((prev) => ({ ...prev, employeeId }));
    }
  }, [searchParams]);

  const taskStats = useMemo(() => {
    return tasks.reduce(
      (stats, task) => {
        stats.total += 1;
        stats[task.status] = (stats[task.status] || 0) + 1;
        return stats;
      },
      {
        total: 0,
        Assigned: 0,
        "In Progress": 0,
        Submitted: 0,
        Completed: 0,
        "Revision Requested": 0,
      }
    );
  }, [tasks]);

  const filteredTasks =
    statusFilter === "All" ? tasks : tasks.filter((task) => task.status === statusFilter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/task", form, { headers });
      if (response.data.success) {
        setForm({
          title: "",
          description: "",
          employeeId: "",
          priority: "Medium",
          dueDate: "",
        });
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to assign task");
    }
  };

  const handleReview = async (taskId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/${taskId}/review`,
        { status, reviewNote: reviewNotes[taskId] || "" },
        { headers }
      );
      if (response.data.success) {
        setReviewNotes((prev) => ({ ...prev, [taskId]: "" }));
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to review task");
    }
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-2xl font-bold text-gray-700">Assign Task</h3>
        <p className="text-sm text-gray-500 mb-6">
          Assign work to a specific employee and track their report.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.employeeId} - {employee.userId?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none resize-none focus:ring-2 focus:ring-green-500"
              rows="5"
              placeholder="Explain task requirements"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                type="date"
                className="block w-full p-2 mt-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Assign Task
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="text-center mb-5">
          <h3 className="text-2xl font-bold text-gray-700">Task Records</h3>
          <p className="text-sm text-gray-500">Review submitted employee task reports.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 md:grid-cols-5">
          {["Assigned", "In Progress", "Submitted", "Completed", "Revision Requested"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
                className={`rounded p-3 text-sm font-semibold ${
                  statusFilter === status ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {status}
                <span className="block text-lg">{taskStats[status]}</span>
              </button>
            )
          )}
        </div>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-500">
                      {task.employeeId?.employeeId} - {task.employeeId?.userId?.name} ·{" "}
                      {task.employeeId?.department?.dep_name || "N/A"}
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
                <div className="mt-3 text-sm text-gray-500">
                  Priority: <span className="font-semibold">{task.priority}</span>
                  {task.dueDate && (
                    <span> · Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>

                {task.reportFile && (
                  <div className="mt-3 rounded bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-700">Employee Report</p>
                    {task.reportNote && <p className="text-sm text-gray-600">{task.reportNote}</p>}
                    <a
                      href={`http://localhost:5000/${task.reportFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Uploaded Report
                    </a>
                  </div>
                )}

                {task.status === "Submitted" && (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={reviewNotes[task._id] || ""}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({ ...prev, [task._id]: e.target.value }))
                      }
                      rows="2"
                      className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Review note for employee"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleReview(task._id, "Completed")}
                        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Mark Completed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(task._id, "Revision Requested")}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}

                {task.reviewNote && (
                  <p className="mt-3 text-sm text-gray-600">
                    <span className="font-semibold">Admin Review:</span> {task.reviewNote}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
