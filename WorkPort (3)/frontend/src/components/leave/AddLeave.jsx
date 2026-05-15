import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddLeave = () => {

   const {user} = useAuth();
   
  const [leave, setLeave] = useState({
    
      userId:user._id,
 
  })

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setLeave((prevState) => ({...prevState,[name] : value}));
  };

  const handleSubmit = async(e)=>{
     e.preventDefault();
     try {
      const response = await axios.post('http://localhost:5000/api/leave/add',leave,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        navigate(`/employee-dashboard/leaves/${user._id}`);
      }
    }
    catch (error) {
      if(error.response && !error.response.data.success){
        alert(error.response.data.error)
       }  
    }
  }

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-md shadow-md mt-[110px]">
      <h2 className="mb-6 text-2xl font-bold">Request for Leave</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              onChange={handleChange}
              name="leaveType"
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none"
              required
            >
              <option value="">Select Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                onChange={handleChange}
                name="startDate"
                type="date"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                onChange={handleChange}
                name="endDate"
                type="date"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              onChange={handleChange}
              name="reason"
              placeholder="Reason"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-none resize-none"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-6 font-bold text-white bg-green-500 rounded hover:bg-green-600"
        >
          Add Leave
        </button>
      </form>
    </div>
  );
};

export default AddLeave;
