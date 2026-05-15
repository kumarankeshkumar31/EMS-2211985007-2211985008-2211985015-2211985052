import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
  
const EditDepartment = () => {

  const {id}  = useParams()
  const [department,setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(true)


  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/department/${id}`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.data.success){
            setDepartment(response.data.department)
        }
      }
      catch (error) {
        if(error.response && !error.response.data.success){
          alert(error.response.data.error)
         }
      }
      finally{
        setDepLoading(false)
      }
    }
    fetchDepartments();
  },[])

  const handleChange = (e) => {
    const {name,value} = e.target;
    setDepartment({...department, [name]: value })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      
      const response = await axios.put(`http://localhost:5000/api/department/${id}`,department,{
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if(response.data.success){
        navigate('/admin-dashboard/departments')
      }
    }
    catch(error){
       if(error.response && !error.response.data.success){
        alert(error.response.data.error)
       }
    }
  }


  return (
    <>{depLoading ? <div>Loding ...</div> :
    <div className='max-w-3xl p-8 mx-auto mt-10 bg-white rounded-md shadow-md w-96'>
    <div>
      <h2 className='mb-6 text-2xl font-bold'>Edit Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="dep_name" className='text-sm font-medium text-gray-700'>Department Name</label>
        <input onChange={handleChange} type="text" name="dep_name" placeholder='Enter Department Name' className='w-full p-2 mt-1 border border-gray-300 rounded-md outline-none' value={department.dep_name} required />
        </div>
        
        <div>
          <label htmlFor="description" className='text-sm font-medium text-gray-700'>Description</label>
          <textarea onChange={handleChange} name='description' placeholder='Enter Description . . .' className='block w-full p-2 mt-1 border border-gray-300 rounded-md outline-none resize-none' rows="4" value={department.description}/>
        </div>
        
        <button className='w-full px-4 py-2 mt-6 font-bold text-white bg-green-500 rounded-md hover:bg-green-600'>Edit Department</button>
      </form>
    </div>
  </div>
  }</>
  )
}

export default EditDepartment