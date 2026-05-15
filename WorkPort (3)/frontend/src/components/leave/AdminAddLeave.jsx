import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAddLeave = () => {
  const { id } = useParams(); // Employee ID
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [leave, setLeave] = useState({
    userId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Fetch employee
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employee:", err);
        setLoading(false);
      });
  }, [id]);

  // Attach userId in leave
  useEffect(() => {
    if (id) {
      setLeave((prev) => ({ ...prev, userId: id }));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/leave/${id}/admin`,
        leave,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Leave added successfully");
        navigate(`/admin-dashboard/employees/leaves/${id}`);
      }
    } catch (error) {
      if (error.response?.data && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading employee details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-10 mx-auto mt-[110px] bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">
        Add Leave for Employee
      </h2>

      <div className="mb-6 text-lg text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Employee Name:</span>{" "}
          <span className="text-gray-900">{user?.employee?.userId?.name}</span>
        </p>
        <p>
          <span className="font-semibold">Employee ID:</span>{" "}
          <span className="text-gray-900">{user?.employee?.employeeId}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Leave Type
          </label>
          <select
            onChange={handleChange}
            name="leaveType"
            value={leave.leaveType}
            className="block w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            required
          >
            <option value="">Select Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              value={leave.startDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              value={leave.endDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="reason"
            value={leave.reason}
            onChange={handleChange}
            placeholder="Enter reason for leave..."
            rows={4}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-all"
        >
          Add Leave
        </button>
      </form>
    </div>
  );
};

export default AdminAddLeave;
