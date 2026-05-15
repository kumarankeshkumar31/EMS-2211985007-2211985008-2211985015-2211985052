import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/department', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.data.success) setDepartments(res.data.departments);
      } catch (err) {
        if (err.response && !err.response.data.success) {
          alert(err.response.data.error);
        }
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => formDataObj.append(key, formData[key]));

    try {
      const res = await axios.post('http://localhost:5000/api/employee/add', formDataObj, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) navigate('/admin-dashboard/employees');
    } catch (err) {
      if (err.response && !err.response.data.success) {
        alert(err.response.data.error);
      } else {
        alert('Failed to add employee. Please check the backend server.');
      }
    }
  };

  return (
    <div className='max-w-4xl p-8 mx-auto bg-white rounded-md shadow-md mt-[15px]'>
      <h2 className='mb-6 text-2xl font-bold'>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Name</label>
            <input onChange={handleChange} type="text" name="name" placeholder='Insert Name' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Email</label>
            <input onChange={handleChange} type="email" name="email" placeholder='Insert Email' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Password</label>
            <input onChange={handleChange} type="password" name="password" placeholder='*****' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Employee ID</label>
            <input onChange={handleChange} type="text" name="employeeId" placeholder='Employee ID' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
            <input onChange={handleChange} type="date" name="dob" placeholder='DOB' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Gender</label>
            <select onChange={handleChange} name="gender" className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Marital Status</label>
            <select onChange={handleChange} name="maritalStatus" className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required>
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div> 
            <label className='block text-sm font-medium text-gray-700'>Designation</label>
            <input onChange={handleChange} type="text" name="designation" placeholder='Designation' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Department</label>
            <select onChange={handleChange} name="department" className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required>
              <option value="">Select Department</option>
              {departments.map(dep => <option value={dep._id} key={dep._id}>{dep.dep_name}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Salary</label>
            <input onChange={handleChange} type="number" name="salary" placeholder='Salary' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Role</label>
            <select onChange={handleChange} name="role" className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Upload Image</label>
            <input onChange={handleChange} type="file" name="image" placeholder='Upload Image' accept='image/*' className='block w-full p-2 mt-1 border border-gray-300 rounded-md' required />
          </div>
        </div>
        
        <button type='submit' className='w-full py-2 mt-6 font-bold text-white bg-green-500 rounded hover:bg-green-600'>Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
