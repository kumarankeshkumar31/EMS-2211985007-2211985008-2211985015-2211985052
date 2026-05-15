import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data.success) setEmployee(res.data.employee);
      } catch (err) {
        if (err.response && !err.response.data.success) alert(err.response.data.error);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold text-center mb-6">Employee Details</h2>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <img
          src={`http://localhost:5000/${employee.userId.profileImage}`}
          alt="profile"
          className="w-48 h-48 rounded-full border shadow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Info label="Name" value={employee.userId.name} />
          <Info label="Employee ID" value={employee.employeeId} />
          <Info label="Email" value={employee.userId.email} />
          <Info label="Date of Birth" value={new Date(employee.dob).toLocaleDateString()} />
          <Info label="Gender" value={employee.gender} />
          <Info label="Marital Status" value={employee.maritalStatus} />
          <Info label="Department" value={employee.department?.dep_name || 'N/A'} />
          <Info label="Designation" value={employee.designation} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <span className="text-gray-600 text-sm">{label}</span>
    <p className="text-gray-900 font-semibold">{value}</p>
  </div>
);

export default EmployeeProfile;
