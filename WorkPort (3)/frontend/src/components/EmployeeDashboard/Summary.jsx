import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

const getLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
    <div className={`${color} text-white p-4 rounded-lg text-2xl`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Summary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState({
    todayAttendance: null,
    history: [],
    monthPresent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [employeeRes, leaveRes, attendanceRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/employee/${user._id}`, { headers }),
        axios.get(`http://localhost:5000/api/leave/${user._id}/${user.role}`, { headers }),
        axios.get("http://localhost:5000/api/attendance/me", { headers }),
      ]);

      if (employeeRes.data.success) setEmployee(employeeRes.data.employee);
      if (leaveRes.data.success) setLeaves(leaveRes.data.leaves);
      if (attendanceRes.data.success) {
        setAttendance({
          todayAttendance: attendanceRes.data.todayAttendance,
          history: attendanceRes.data.history || [],
          monthPresent: attendanceRes.data.monthPresent || 0,
        });
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchDashboard();
  }, [user?._id]);

  const leaveStats = useMemo(() => {
    return leaves.reduce(
      (stats, leave) => {
        const status = leave.status || "Pending";
        stats.total += 1;
        stats[status] = (stats[status] || 0) + 1;
        return stats;
      },
      { total: 0, Pending: 0, Approved: 0, Rejected: 0 }
    );
  }, [leaves]);

  const recentLeaves = leaves.slice(0, 5);

  const handleMarkPresent = async () => {
    setMarking(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark-present",
        {},
        { headers }
      );
      if (response.data.success) fetchDashboard();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-lg shadow p-6 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {employee?.userId?.profileImage ? (
              <img
                src={`http://localhost:5000/${employee.userId.profileImage}`}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                <FaUser />
              </div>
            )}
            <div>
              <p className="text-green-100">Welcome Back</p>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-sm text-green-50">
                {employee?.designation || "Employee"} · {employee?.department?.dep_name || "Department"}
              </p>
            </div>
          </div>

          <div className="bg-white/15 rounded-lg p-4 min-w-[240px]">
            <p className="text-sm text-green-50">Today Attendance</p>
            <h3 className="text-2xl font-bold">
              {attendance.todayAttendance ? "Present" : "Not Marked"}
            </h3>
            <button
              type="button"
              onClick={handleMarkPresent}
              disabled={Boolean(attendance.todayAttendance) || marking}
              className={`mt-3 w-full rounded-md px-4 py-2 text-sm font-semibold transition ${
                attendance.todayAttendance
                  ? "bg-white/20 text-white cursor-not-allowed"
                  : "bg-white text-green-700 hover:bg-green-50"
              }`}
            >
              {attendance.todayAttendance ? "Marked Today" : marking ? "Marking..." : "Mark Present"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <StatCard
          icon={<FaCalendarCheck />}
          label="Present This Month"
          value={attendance.monthPresent}
          color="bg-green-600"
        />
        <StatCard
          icon={<FaFileAlt />}
          label="Total Leaves"
          value={leaveStats.total}
          color="bg-blue-600"
        />
        <StatCard
          icon={<FaHourglassHalf />}
          label="Pending Leaves"
          value={leaveStats.Pending}
          color="bg-orange-500"
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="Approved Leaves"
          value={leaveStats.Approved}
          color="bg-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recent Leave Records</h3>
              <p className="text-sm text-gray-500">Track approvals, pending requests, and rejected leaves.</p>
            </div>
            <Link
              to={`/employee-dashboard/leaves/${user._id}`}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <tr key={leave._id} className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-800">{leave.leaveType}</td>
                      <td className="px-4 py-3">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{getLeaveDays(leave.startDate, leave.endDate)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No leave records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate("/employee-dashboard/add-leave")}
            className="w-full bg-white rounded-lg shadow p-5 text-left hover:ring-2 hover:ring-green-300"
          >
            <FaFileAlt className="text-2xl text-green-600 mb-3" />
            <h4 className="font-bold text-gray-800">Apply for Leave</h4>
            <p className="text-sm text-gray-500">Submit a sick, casual, or annual leave request.</p>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/employee-dashboard/profile/${user._id}`)}
            className="w-full bg-white rounded-lg shadow p-5 text-left hover:ring-2 hover:ring-green-300"
          >
            <FaUser className="text-2xl text-blue-600 mb-3" />
            <h4 className="font-bold text-gray-800">My Account</h4>
            <p className="text-sm text-gray-500">Review your profile and employment details.</p>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/employee-dashboard/salary/${user._id}`)}
            className="w-full bg-white rounded-lg shadow p-5 text-left hover:ring-2 hover:ring-green-300"
          >
            <FaMoneyBillWave className="text-2xl text-yellow-600 mb-3" />
            <h4 className="font-bold text-gray-800">Salary Records</h4>
            <p className="text-sm text-gray-500">View your salary history and payments.</p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/employee-dashboard/attendance")}
            className="w-full bg-white rounded-lg shadow p-5 text-left hover:ring-2 hover:ring-green-300"
          >
            <FaClock className="text-2xl text-purple-600 mb-3" />
            <h4 className="font-bold text-gray-800">Attendance History</h4>
            <p className="text-sm text-gray-500">Check your recent present records.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
