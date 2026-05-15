import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext';
import axios from 'axios';



const Setting = () => {

  const navigate = useNavigate();
  const {user} = useAuth();
  const [setting, setSetting] = useState({
    userId:user._id,
    oldPassword:"",
    newPassword:"",
    confirmPassword:"",
  })
  const [error,setError]  = useState(null);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setSetting({...setting,[name]: value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(setting.newPassword !== setting.confirmPassword){
      setError("Password not matched");
    } else{
    try {
      const response = await axios.put("http://localhost:5000/api/setting/change-password",setting,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        setError("");
        navigate(user.role === "employee" ? "/employee-dashboard" : "/admin-dashboard");
      } 
    }   
    catch (error) {
      if(error.response && !error.response.data.success){
        alert(error.message)
       }
    }
  }
}
  return (
    <div className='max-w-3xl p-8 mx-auto bg-white rounded-md shadow-md w-96  mt-[110px]'>
        <h2 className='mb-6 text-2xl font-bold'>Change Password</h2>
        <p className='text-red-500'>{error}</p>
        <form onSubmit={handleSubmit}>

          
          <div>
            <label className='block text-sm font-medium text-gray-700'>Old Password</label>
            <input onChange={handleChange} type="password" name="oldPassword" placeholder='Change Password' className='block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none' required />
          </div>
         
          <div>
            <label className='block text-sm font-medium text-gray-700'>New Password</label>
            <input onChange={handleChange} type="password" name="newPassword" placeholder='New Password' className='block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none' required />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700'>Confirm Password</label>
            <input onChange={handleChange} type="password" name="confirmPassword" placeholder='Confirm Password' className='block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none' required />
          </div>
          
            <button type='submit' className='w-full px-4 py-2 mt-6 font-bold text-white bg-green-500 rounded hover:bg-green-600'>Change Password</button>
        
        </form>
      </div>
  )
}

export default Setting
