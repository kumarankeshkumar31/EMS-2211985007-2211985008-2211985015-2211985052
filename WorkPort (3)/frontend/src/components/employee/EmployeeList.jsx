import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [filterdEmployees, setFilterdEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            employeeId: emp.employeeId || "N/A",
            dep_name: emp.department?.dep_name || "N/A",
            name: emp.userId?.name || "N/A",
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: emp.userId?.profileImage
              ? `http://localhost:5000/${emp.userId.profileImage}`
              : "",
          }));
          setEmployees(data);
          setFilterdEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert("Failed to fetch employees. Please check the backend server.");
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filterEmployees = (e) => {
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterdEmployees(records);
  };

  return (
    <>
      {empLoading ? (
        <div className="text-center py-10 text-lg">Loading...</div>
      ) : (
        <div className="p-6 bg-white rounded shadow">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-700">Manage Employees</h3>
          </div>

          <div className="flex items-center justify-between mb-4">
            <input
              onChange={filterEmployees}
              className="px-4 py-2 border border-gray-400 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              placeholder="Search by employee name"
            />
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
            >
              Add New Employee
            </Link>
          </div>

          {/* Simple Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-2 border">S.No</th>
                   <th className="px-4 py-2 border">Emp Id</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Department</th>
                  <th className="px-4 py-2 border">DOB</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterdEmployees.length > 0 ? (
                  filterdEmployees.map((emp) => (
                    <tr key={emp._id} className="text-center hover:bg-gray-100">
                      <td className="px-4 py-2 border">{emp.sno}</td>
                       <td className="px-4 py-2 border">{emp.employeeId}</td>
                      <td className="px-4 py-2 border">{emp.name}</td>
                      <td className="px-4 py-2 border">
                        {emp.profileImage ? (
                          <img
                            src={emp.profileImage}
                            alt="profile"
                            className="w-10 h-10 rounded-full mx-auto object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full mx-auto bg-gray-200" />
                        )}
                      </td>
                      <td className="px-4 py-2 border">{emp.dep_name}</td>
                      <td className="px-4 py-2 border">{emp.dob}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            className="px-3 py-1 text-white bg-pink-600 rounded hover:bg-pink-700"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}`)
                            }
                          >
                            View
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/edit/${emp._id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/salary/${emp._id}`)
                            }
                          >
                            Salary
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/leaves/${emp._id}`)
                            }
                          >
                            Leave
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                            onClick={() =>
                              navigate(`/admin-dashboard/tasks?employeeId=${emp._id}`)
                            }
                          >
                            Task
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-gray-500 border"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
