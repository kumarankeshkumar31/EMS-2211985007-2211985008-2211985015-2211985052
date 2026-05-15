import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/department', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          ...dep,
          sno: sno++,
        }));
        setDepartments(data);
        setFilteredDepartments(data);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(query)
    );
    setFilteredDepartments(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Do you want to delete?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/department/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          fetchDepartments();
        }
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete department');
      }
    }
  };

  return loading ? (
    <div>Loading ...</div>
  ) : (
    <div className="p-5">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          onChange={filterDepartments}
          className="px-8 py-1 border border-blue-500 rounded outline-none"
          type="text"
          placeholder="Search By Dept Name"
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-1 text-white bg-green-600 rounded"
        >
          Add New Department
        </Link>
      </div>

      {filteredDepartments.length > 0 ? (
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-50 border-b text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-2">SNO</th>
              <th className="px-6 py-2">Department Name</th>
              <th className="px-6 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dep) => (
              <tr key={dep._id} className="bg-white border-b">
                <td className="px-6 py-2">{dep.sno}</td>
                <td className="px-6 py-2">{dep.dep_name}</td>
                <td className="px-6 py-2 flex space-x-2">
                  <button
                    className="px-3 py-1 text-white bg-green-600 rounded"
                    onClick={() => navigate(`/admin-dashboard/department/${dep._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-white bg-red-500 rounded"
                    onClick={() => handleDelete(dep._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">No Records</div>
      )}
    </div>
  );
};

export default DepartmentList;
