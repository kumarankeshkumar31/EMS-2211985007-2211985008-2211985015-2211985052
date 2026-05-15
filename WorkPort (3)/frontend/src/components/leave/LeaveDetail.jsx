import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LeaveDetail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data.success) setLeave(res.data.leave);
      } catch {
        alert('Failed to fetch leave details');
      }
    };
    fetchLeave();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/leave/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) setLeave((prev) => ({ ...prev, status }));
      else alert('Failed to update status');
    } catch {
      alert('Error updating status');
    }
  };

  if (!leave)
    return <p className="text-center mt-20 text-gray-600">Loading leave details...</p>;

  const { employeeId: emp } = leave;
  const { userId: user, department } = emp;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold text-center mb-6">Leave Application</h2>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <img
          src={`http://localhost:5000/${user.profileImage}`}
          alt="profile"
          className="w-48 h-48 rounded-full border shadow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-gray-700">
          <Info label="Name" value={user.name} />
          <Info label="Employee ID" value={emp.employeeId} />
          <Info label="Department" value={department?.dep_name || 'N/A'} />
          <Info label="Leave Type" value={leave.leaveType} />
          <Info label="Start Date" value={new Date(leave.startDate).toLocaleDateString()} />
          <Info label="End Date" value={new Date(leave.endDate).toLocaleDateString()} />
          <Info label="Reason" value={leave.reason} multiline />

          <div className="sm:col-span-2 mt-4">
            <span className="text-gray-600 text-sm">Status:</span>
            {leave.status === 'Pending' ? (
              <div className="flex gap-4 mt-2">
                <button
                  className="px-4 py-1 bg-green-600 text-white font-semibold rounded"
                  onClick={() => updateStatus('Approved')}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-1 bg-red-600 text-white font-semibold rounded"
                  onClick={() => updateStatus('Rejected')}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span
                className={`inline-block mt-2 px-4 py-1 rounded text-white font-semibold ${
                  leave.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {leave.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, multiline = false }) => (
  <div>
    <span className="text-gray-600 text-sm">{label}</span>
    <p className={`text-gray-900 font-semibold ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
  </div>
);

export default LeaveDetail;
