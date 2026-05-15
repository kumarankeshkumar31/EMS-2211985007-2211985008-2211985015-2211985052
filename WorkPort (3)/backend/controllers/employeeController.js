import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import multer from "multer"
import path from "path"



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
})

const upload = multer({
  storage:storage
})

const addEmployee = async(req,res)=>{

  try{
    const {name,email,password,employeeId,dob,gender,maritalStatus,designation, department,salary,role } = req.body;

    if (!name || !email || !password || !employeeId || !dob || !gender || !maritalStatus || !designation || !department || !salary || !role) {
      return res.status(400).json({ success: false, error: "Please fill all employee fields" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload an employee image" });
    }



     // Check if the employeeId already exists
     const existingEmployee = await Employee.findOne({ employeeId });
     if (existingEmployee) {
       return res.status(400).json({ success: false, error: "Employee ID already exists" });
     }

  const user  = await User.findOne({email})
  if(user){
    return res.status(400).json({success:false, error: "Email already exists in Employee"})
  }

  const newUser = new User({
    name,
    email,
    password,
    role,
    profileImage: req.file ? req.file.filename : "",
  })
 const savedUser =  await newUser.save();
 const newEmployee = new Employee({
  userId: savedUser._id,
  employeeId,
  dob,
  gender,
  maritalStatus, 
  designation,
  department,
  salary,
 })
 await newEmployee.save();
 return res.status(200).json({success:true, message: "Employee Created"})
  }
  catch(error){
    console.error("Error in addEmployee:", error);
    return res.status(500).json({success:false, error: "add employee Server Error"})
  }
}



const getEmployees = async(req,res)=>{
  try{
    const employees = await Employee.find().populate('userId',{password:0}).populate('department')
    return res.status(200).json({success:true, employees})
  }
  catch(error){
    console.error("Error in getEmployees:", error);
    return res.status(500).json({success:false, error: "get employees Server Error"})
  }
}

const getEmployee = async(req,res)=>{
  const {id} = req.params;  
  try{
    let employee;
    employee = await Employee.findById({_id:id}).populate('userId',{password:0}).populate('department');
    if(!employee){
     employee  = await Employee.findOne({userId:id}).populate('userId',{password:0}).populate('department');
    }
    return res.status(200).json({success:true, employee})
  }
  catch(error){
    console.error("Error in getEmployees:", error);
    return res.status(500).json({success:false, error: "get employees Server Error"})
  }
}


const updateEmployee = async(req,res)=>{
  try{
    const {id} = req.params;
    const {name,maritalStatus,designation, department,salary} = req.body;

    const employee = await Employee.findById({_id:id});
    if(!employee){
      return res.status(404).json({success:false, error: "Employee not found"})
    }

    const user = await User.findById({_id:employee.userId});
    if(!user){
      return res.status(404).json({success:false, error: "User not found"})
    }

    const updateUser = await User.findByIdAndUpdate({_id:employee.userId},{name});
    const updateEmployee = await Employee.findByIdAndUpdate({_id:id},{maritalStatus,designation,salary,department})
    if(!updateUser || !updateEmployee){
      return res.status(404).json({success:false, error: "deocument not found"})
    }
    return res.status(200).json({success:true, message: "Employee Updated"})
  }
  catch(error){
    console.error("Error in updateEmployee:", error);
    return res.status(500).json({success:false, error: "update employee Server Error"})
  }
}



const fetchEmployeesByDepId = async(req,res)=>{
  const {id} = req.params;
  try{
    const employees = await Employee.find({department:id})
    return res.status(200).json({success:true, employees})
  }
  catch(error){
    console.error("Error in getEmployees:", error);
    return res.status(500).json({success:false, error: "get employeesByDepId Server Error"})
  }
}
export {addEmployee,upload,getEmployees,getEmployee,updateEmployee,fetchEmployeesByDepId} 
