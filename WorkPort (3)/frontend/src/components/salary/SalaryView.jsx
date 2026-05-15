import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const SalaryView = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();
  let sno = 1;

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const salaryOwnerId = user.role === 'admin' ? user._id || 'all' : id;
        const response = await axios.get(
          `http://localhost:5000/api/salary/${salaryOwnerId}/${user.role}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (response.data.success) {
          setSalaries(response.data.salary);
          setFilteredSalaries(response.data.salary);
        }
      } catch (error) {
        alert(error.message || 'Failed to fetch salaries');
      }
    };
    fetchSalaries();
  }, [id, user._id, user.role]);

  const filterSalaries = (e) => {
  const query = e.target.value.toLowerCase();
  if (!query) {
    setFilteredSalaries(salaries);
    return;
  }
  const filtered = salaries.filter((s) => {
    const empId =
      typeof s.employeeId === "object"
        ? s.employeeId.employeeId
        : s.employeeId;
    return empId?.toLowerCase().includes(query);
  });
  setFilteredSalaries(filtered);
};


  if (!filteredSalaries) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-5 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Salary History</h2>

      <div className="flex justify-end mb-3">
      { user.role=='admin'&&( 
         <input
          onChange={filterSalaries}
          type="text"
          placeholder="Search By Emp ID"
          className="border border-blue-500 px-2 py-1 rounded outline-none"
        />)
      }
      </div>

      {filteredSalaries.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">SNO</th>
              <th className="px-4 py-2">Emp ID</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Allowance</th>
              <th className="px-4 py-2">Deduction</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary._id} className="bg-white border-b">
                <td className="px-4 py-2">{sno++}</td>
                <td className="px-4 py-2">{salary.employeeId.employeeId}</td>
                <td className="px-4 py-2">{salary.basicSalary}</td>
                <td className="px-4 py-2">{salary.allowances}</td>
                <td className="px-4 py-2">{salary.deductions}</td>
                <td className="px-4 py-2">{salary.netSalary}</td>
                <td className="px-4 py-2">{new Date(salary.payDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">No Records</p>
      )}
    </div>
  );
};

export default SalaryView;
