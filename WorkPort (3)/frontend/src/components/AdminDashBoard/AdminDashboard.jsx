import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";

// Reusable Summary Card
const SummaryCard = ({ icon, text, number, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${color} p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center min-h-[150px] hover:scale-105 transform transition cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-200`}
  >
    <div className="mb-4">{icon}</div>
    <p className="text-lg font-semibold text-white mb-2">{text}</p>
    <h3 className="text-2xl font-bold text-white">{number}</h3>
  </button>
);

// Dashboard Overview Section
const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(res.data);
      } catch (error) {
        alert(error.response?.data?.error || "Failed to load summary");
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-10 bg-gradient-to-br from-blue-100 via-emerald-100 to-green-100 rounded-lg">
      <h3 className="text-3xl font-bold text-gray-800 text-center">
        Dashboard Overview
      </h3>

      {/* Top Summary Cards */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 mt-10 mx-auto md:grid-cols-3">
        <SummaryCard
          icon={<FaUsers className="text-3xl text-white" />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-gradient-to-r from-green-400 via-green-500 to-green-600"
          onClick={() => navigate("/admin-dashboard/employees")}
        />
        <SummaryCard
          icon={<FaBuilding className="text-3xl text-white" />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"
          onClick={() => navigate("/admin-dashboard/departments")}
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-3xl text-white" />}
          text="Total Salary Pay"
          number={summary.totalSalary}
          color="bg-gradient-to-r from-red-400 via-red-500 to-red-600"
          onClick={() => navigate("/admin-dashboard/salary")}
        />
      </div>

      {/* Leave Summary */}
      <div className="w-full max-w-5xl mt-20 mx-auto">
        <h4 className="text-2xl font-bold text-center text-gray-700 mb-8">
          Leave Details
        </h4>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<FaFileAlt className="text-3xl text-white" />}
            text="Employees Applied for Leave"
            number={summary.leaveSummary.appliedFor}
            color="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
            onClick={() => navigate("/admin-dashboard/leaves")}
          />
          <SummaryCard
            icon={<FaCheckCircle className="text-3xl text-white" />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            color="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600"
            onClick={() => navigate("/admin-dashboard/leaves?status=Approved")}
          />
          <SummaryCard
            icon={<FaHourglassHalf className="text-3xl text-white" />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            color="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
            onClick={() => navigate("/admin-dashboard/leaves?status=Pending")}
          />
          <SummaryCard
            icon={<FaTimesCircle className="text-3xl text-white" />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            color="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
            onClick={() => navigate("/admin-dashboard/leaves?status=Rejected")}
          />
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">WorkPort</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Welcome, {user?.name}</p>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white shadow-md flex space-x-2 px-6 py-3 overflow-x-auto">
        {[
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/admin-dashboard/employees", label: "Employees" },
          { to: "/admin-dashboard/departments", label: "Departments" },
          { to: "/admin-dashboard/attendance", label: "Attendance" },
          { to: "/admin-dashboard/chat", label: "Chat" },
          { to: "/admin-dashboard/announcements", label: "Announcements" },
          { to: "/admin-dashboard/tasks", label: "Tasks" },
          { to: "/admin-dashboard/leaves", label: "Leaves" },
          { to: "/admin-dashboard/salary/add", label: "Salary" },
          { to: "/admin-dashboard/setting", label: "Setting" },
        ].map((tab, index) => (
          <NavLink
            key={index}
            to={tab.to}
            end={tab.to === "/admin-dashboard"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        {location.pathname === "/admin-dashboard" ? <AdminSummary /> : <Outlet />}
      </div>
    </div>
  );
};

export default AdminDashboard;
