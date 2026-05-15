import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const fetchDepartments = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/department", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.data.success) return res.data.departments;
  } catch (err) {
    alert(err.response?.data?.error || "Failed to fetch departments");
  }
  return [];
};

export const getEmployees = async (depId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/employee/department/${depId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.data.success) return res.data.employees;
  } catch (err) {
    alert(err.response?.data?.error || "Failed to fetch employees");
  }
  return [];
};

const AddSalary = () => {
  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const loadDepartments = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
    };
    loadDepartments();
  }, []);


  const handleDepartmentChange = async (e) => {
    const depId = e.target.value;
    const emps = await getEmployees(depId);
    setEmployees(emps);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prev) => ({ ...prev, [name]: value }));
  };

  // Submit salary
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/salary/add", salary, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) navigate("/admin-dashboard/employees");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add salary");
    }
  };

  if (!departments.length) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-md shadow-md mt-20">
      <h2 className="mb-6 text-2xl font-bold">Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              onChange={handleDepartmentChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              onChange={handleChange}
              name="employeeId"
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.employeeId || emp._id}>
                  {emp.employeeId || emp.userId?.employeeId || emp.userId?.name}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              placeholder="Basic Salary"
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700">Allowances</label>
            <input
              type="number"
              name="allowances"
              placeholder="Allowances"
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

     
          <div>
            <label className="block text-sm font-medium text-gray-700">Deductions</label>
            <input
              type="number"
              name="deductions"
              placeholder="Deductions"
              onChange={handleChange}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

        
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-6 font-bold text-white bg-green-500 rounded hover:bg-green-600"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

export default AddSalary;
