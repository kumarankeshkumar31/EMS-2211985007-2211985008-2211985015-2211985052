import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setAttendance(response.data.history || []);
        }
      } catch (error) {
        alert(error.response?.data?.error || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
        <p className="text-sm text-gray-500">Your latest daily present records.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border">S.No</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Check In</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((record, index) => (
                <tr key={record._id} className="border-b">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="px-4 py-3 border">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    {new Date(record.checkInTime).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No attendance records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;
