import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'All';

  useEffect(() => {
    const getLeaveDays = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const fetchLeaves = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leave', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          const formatted = data.leaves.map((leave, index) => ({
            sno: index + 1,
            _id: leave._id,
            employeeId: leave.employeeId?.employeeId || 'N/A',
            name: leave.employeeId?.userId?.name || 'N/A',
            leaveType: leave.leaveType || 'N/A',
            department: leave.employeeId?.department?.dep_name || 'N/A',
            days: getLeaveDays(leave.startDate, leave.endDate),
            status: leave.status || 'Pending',
          }));
          setLeaves(formatted);
          if (statusFilter === 'All') {
            setFilteredLeaves(formatted);
          } else {
            setFilteredLeaves(
              formatted.filter(
                (leave) => leave.status.toLowerCase() === statusFilter.toLowerCase()
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };

    fetchLeaves();
  }, [statusFilter]);

  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(query)
    );
    setFilteredLeaves(filtered);
  };

  const filterByButton = (status) => {
    if (status === 'All') {
      setSearchParams({});
      return setFilteredLeaves(leaves);
    }
    setSearchParams({ status });
    setFilteredLeaves(
      leaves.filter((leave) => leave.status.toLowerCase() === status.toLowerCase())
    );
  };

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex items-center justify-between mt-4">
        <input
          type="text"
          placeholder="Search By Emp Id"
          className="px-4 py-1 border border-blue-500 rounded"
          onChange={filterByInput}
        />

        <div className="space-x-3">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`px-2 py-1 text-white rounded ${
                statusFilter === status
                  ? 'ring-2 ring-offset-2 ring-green-500 '
                  : ''
              }${
                status === 'All'
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : status === 'Pending'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : status === 'Approved'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={() => filterByButton(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {filteredLeaves.length > 0 ? (
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-50 border-b text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Sno</th>
                <th className="px-4 py-2">Emp Id</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Days</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id} className="bg-white border-b">
                  <td className="px-4 py-2">{leave.sno}</td>
                  <td className="px-4 py-2">{leave.employeeId}</td>
                  <td className="px-4 py-2">{leave.name}</td>
                  <td className="px-4 py-2">{leave.leaveType}</td>
                  <td className="px-4 py-2">{leave.department}</td>
                  <td className="px-4 py-2">{leave.days}</td>
                  <td className="px-4 py-2">{leave.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleView(leave._id)}
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-4 text-gray-500">No Records</div>
        )}
      </div>
    </div>
  );
};

export default LeaveList;
