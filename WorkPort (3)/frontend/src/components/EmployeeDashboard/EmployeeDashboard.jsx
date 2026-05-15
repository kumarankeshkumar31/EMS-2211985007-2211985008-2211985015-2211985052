import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "employee") {
      navigate("/admin-dashboard");
    }
  }, [user, navigate]);

  const navItems = [
    { to: `/employee-dashboard`, label: "Dashboard" },
    { to: `/employee-dashboard/profile/${user?._id}`, label: "My Account" },
    { to: `/employee-dashboard/attendance`, label: "Attendance" },
    { to: `/employee-dashboard/leaves/${user?._id}`, label: "Leaves" },
    { to: `/employee-dashboard/add-leave`, label: "Apply Leave" },
    { to: `/employee-dashboard/salary/${user?._id}`, label: "Salary" },
    { to: `/employee-dashboard/tasks`, label: "Tasks" },
    { to: `/employee-dashboard/chat`, label: "Chat" },
    { to: `/employee-dashboard/announcements`, label: "Announcements" },
    { to: `/employee-dashboard/setting`, label: "Password" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md flex flex-col p-4">
        <h2 className="text-xl font-bold text-green-700 mb-6">WorkPort</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.to}
              end={tab.to === "/employee-dashboard"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-semibold">Employee Dashboard</h1>
          <div className="flex items-center gap-3">
            <NavLink
              to={`/employee-dashboard/profile/${user?._id}`}
              className="bg-white text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
            >
              My Profile
            </NavLink>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
