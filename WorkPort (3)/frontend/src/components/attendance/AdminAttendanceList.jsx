import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaCalendarCheck,
  FaDownload,
  FaFileAlt,
  FaSearch,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-4 p-5 rounded-lg border ${color}`}>
    <div className="p-3 text-white bg-black/20 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
    </div>
  </div>
);

const AdminAttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [absentToday, setAbsentToday] = useState([]);
  const [leaveToday, setLeaveToday] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    todayOnLeave: 0,
    monthPresent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("records");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setRecords(response.data.records || []);
          setAbsentToday(response.data.absentToday || []);
          setLeaveToday(response.data.leaveToday || []);
          setSummary(
            response.data.summary || {
              totalEmployees: 0,
              todayPresent: 0,
              todayAbsent: 0,
              todayOnLeave: 0,
              monthPresent: 0,
            }
          );
        }
      } catch (error) {
        alert(error.response?.data?.error || "Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase();
    return records.filter((record) => {
      const employee = record.employeeId;
      const employeeDate = new Date(record.date).toISOString().slice(0, 10);
      const matchesDate = !dateFilter || employeeDate === dateFilter;
      const matchesSearch =
        !query ||
        employee?.employeeId?.toLowerCase().includes(query) ||
        employee?.userId?.name?.toLowerCase().includes(query) ||
        employee?.department?.dep_name?.toLowerCase().includes(query);

      return matchesDate && matchesSearch;
    });
  }, [records, search, dateFilter]);

  const filteredAbsent = useMemo(() => {
    const query = search.toLowerCase();
    return absentToday.filter((employee) => {
      return (
        !query ||
        employee?.employeeId?.toLowerCase().includes(query) ||
        employee?.userId?.name?.toLowerCase().includes(query) ||
        employee?.department?.dep_name?.toLowerCase().includes(query)
      );
    });
  }, [absentToday, search]);

  const filteredLeave = useMemo(() => {
    const query = search.toLowerCase();
    return leaveToday.filter((leave) => {
      const employee = leave.employeeId;
      return (
        !query ||
        employee?.employeeId?.toLowerCase().includes(query) ||
        employee?.userId?.name?.toLowerCase().includes(query) ||
        employee?.department?.dep_name?.toLowerCase().includes(query) ||
        leave.leaveType?.toLowerCase().includes(query)
      );
    });
  }, [leaveToday, search]);

  const downloadCsv = () => {
    let rows;
    if (activeTab === "records") {
      rows = [
        ["Emp ID", "Name", "Department", "Designation", "Date", "Check In", "Status"],
        ...filteredRecords.map((record) => {
          const employee = record.employeeId;
          return [
            employee?.employeeId || "N/A",
            employee?.userId?.name || "N/A",
            employee?.department?.dep_name || "N/A",
            employee?.designation || "N/A",
            new Date(record.date).toLocaleDateString(),
            new Date(record.checkInTime).toLocaleTimeString(),
            record.status,
          ];
        }),
      ];
    } else if (activeTab === "leave") {
      rows = [
        ["Emp ID", "Name", "Department", "Designation", "Leave Type", "From", "To", "Status"],
        ...filteredLeave.map((leave) => {
          const employee = leave.employeeId;
          return [
            employee?.employeeId || "N/A",
            employee?.userId?.name || "N/A",
            employee?.department?.dep_name || "N/A",
            employee?.designation || "N/A",
            leave.leaveType || "N/A",
            new Date(leave.startDate).toLocaleDateString(),
            new Date(leave.endDate).toLocaleDateString(),
            "On Leave Today",
          ];
        }),
      ];
    } else {
      rows = [
        ["Emp ID", "Name", "Department", "Designation", "Email", "Status"],
        ...filteredAbsent.map((employee) => [
          employee?.employeeId || "N/A",
          employee?.userId?.name || "N/A",
          employee?.department?.dep_name || "N/A",
          employee?.designation || "N/A",
          employee?.userId?.email || "N/A",
          "Absent Today",
        ]),
      ];
    }

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      activeTab === "records"
        ? "attendance-records.csv"
        : activeTab === "leave"
        ? "on-leave-today.csv"
        : "absent-today.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading attendance...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-700">Employee Attendance</h3>
        <p className="text-sm text-gray-500">
          Track present employees, absent employees, and export reports for records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
        <StatCard
          icon={<FaUsers />}
          label="Total Employees"
          value={summary.totalEmployees}
          color="bg-gray-50 border-gray-200"
        />
        <StatCard
          icon={<FaCalendarCheck />}
          label="Present Today"
          value={summary.todayPresent}
          color="bg-green-50 border-green-100"
        />
        <StatCard
          icon={<FaTimesCircle />}
          label="Absent Today"
          value={summary.todayAbsent}
          color="bg-red-50 border-red-100"
        />
        <StatCard
          icon={<FaFileAlt />}
          label="On Leave Today"
          value={summary.todayOnLeave}
          color="bg-yellow-50 border-yellow-100"
        />
        <StatCard
          icon={<FaCalendarCheck />}
          label="Month Records"
          value={summary.monthPresent}
          color="bg-blue-50 border-blue-100"
        />
      </div>

      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              activeTab === "records"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Present Records
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("absent")}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              activeTab === "absent"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Absent Today
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leave")}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              activeTab === "leave"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            On Leave Today
          </button>
        </div>

        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-1/3">
          <FaSearch className="absolute text-gray-400 left-3 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            placeholder="Search name, emp id, department"
          />
        </div>
        {activeTab === "records" && (
          <input
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            type="date"
          />
        )}
      </div>

      <div className="overflow-x-auto">
        {activeTab === "records" ? (
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Emp ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Designation</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Check In</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => {
                  const employee = record.employeeId;
                  return (
                    <tr key={record._id} className="text-center hover:bg-gray-100">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{employee?.employeeId || "N/A"}</td>
                      <td className="px-4 py-2 border">{employee?.userId?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">
                        {employee?.department?.dep_name || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">{employee?.designation || "N/A"}</td>
                      <td className="px-4 py-2 border">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(record.checkInTime).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 border">
                        <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500 border">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : activeTab === "leave" ? (
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Emp ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Designation</th>
                <th className="px-4 py-2 border">Leave Type</th>
                <th className="px-4 py-2 border">From</th>
                <th className="px-4 py-2 border">To</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeave.length > 0 ? (
                filteredLeave.map((leave, index) => {
                  const employee = leave.employeeId;
                  return (
                    <tr key={leave._id} className="text-center hover:bg-gray-100">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{employee?.employeeId || "N/A"}</td>
                      <td className="px-4 py-2 border">{employee?.userId?.name || "N/A"}</td>
                      <td className="px-4 py-2 border">
                        {employee?.department?.dep_name || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">{employee?.designation || "N/A"}</td>
                      <td className="px-4 py-2 border">{leave.leaveType || "N/A"}</td>
                      <td className="px-4 py-2 border">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                          On Leave
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-500 border">
                    No employees are on approved leave today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Emp ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Designation</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsent.length > 0 ? (
                filteredAbsent.map((employee, index) => (
                  <tr key={employee._id} className="text-center hover:bg-gray-100">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{employee?.employeeId || "N/A"}</td>
                    <td className="px-4 py-2 border">{employee?.userId?.name || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {employee?.department?.dep_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">{employee?.designation || "N/A"}</td>
                    <td className="px-4 py-2 border">{employee?.userId?.email || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                        Absent Today
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500 border">
                    No absent employees found for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceList;
