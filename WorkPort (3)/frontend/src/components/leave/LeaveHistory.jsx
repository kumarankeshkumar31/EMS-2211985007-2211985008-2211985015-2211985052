import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from'react-router-dom'
import { useAuth } from '../../context/authContext';

const LeaveHistory = () => {

  const [leaves, setLeaves] = useState([]);
  const {id}  = useParams();
  const {user} = useAuth();
  let sno = 1;
  
  const fetchLeaves= async () => {
    
    try {
      const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
       if(response.data.success){
        setLeaves(response.data.leaves);  
      }
    }
    catch (error) {
      if(error.response && !error.response.data.success){
        alert(error.message)
       }
    }
  };
  
  useEffect(() => {
    fetchLeaves();
  }, [])

  
  return (
    <div className='p-6'>
       <div className='text-center'>
         <h2 className='mb-6 text-2xl font-bold'>Leaves History</h2>
       </div>
       
       <div className='flex items-center justify-between'>
        {/* <input type="text" placeholder='Search By Dept Name' className='px-4 py-0.5 border border-blue-500 rounded outline-none' />  */}
        {
          user.role=='admin'&&(
            <Link to={`/admin-dashboard/add-leave/${id}`} className="px-4 py-1 text-white bg-green-600 rounded">Add New Leave</Link>
          )
        }

         {
          user.role=='employee'&&(
             <Link to="/employee-dashboard/add-leave" className="px-4 py-1 text-white bg-green-600 rounded">Add New Leave</Link>
          )
        }
       </div>

      {/*display all leave record */}

      <table className='w-full mt-6 text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase border border-gray-200 bg-gray-50'>
                  <tr>
                  <th className='px-6 py-3'>SNO</th>
                    <th className='px-6 py-3'>Leave Type</th>
                    <th className='px-6 py-3'>From</th>
                    <th className='px-6 py-3'>To</th>
                    <th className='px-6 py-3'>Description</th>
                    <th className='px-6 py-3'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className='bg-white border-b'>
                      <td className='px-6 py-3'>
                        {sno++}
                      </td> 
                      <td className='px-6 py-3'>
                        {leave.leaveType}
                      </td>
                      <td className='px-6 py-3'>
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-3'>
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-3'>
                        {leave.reason}
                      </td>
                      <td className='px-6 py-3'>
                        {leave.status}
                      </td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
    </div>
  )
}

export default LeaveHistory;