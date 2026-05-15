
import Leave from "../models/Leave.js"; 
import Employee from "../models/Employee.js";


const addLeave = async(req,res)=>{
  try{
    const {userId,leaveType,startDate,endDate,reason} = req.body;
    const employee = await Employee.findOne({userId})

    const newLeave = new Leave({
      employeeId:employee._id,
      leaveType,
      startDate,
      endDate,
      reason
     });
     await newLeave.save();
     return res.status(200).json({success:true, message: "Leave added successfully"});
    }
 catch(error){
    console.error("Error in addLeave:", error);
    return res.status(500).json({success:false, error: "add leave Server Error"});
 }
}

const adminAddLeave = async (req, res) => {
  try {
    const { id } = req.params; // Employee ID from URL
    const { leaveType, startDate, endDate, reason } = req.body;

    // Find employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    return res
      .status(200)
      .json({ success: true, message: "Leave added successfully" });
  } catch (error) {
    console.error("Error in adminAddLeave:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getLeave = async(req,res)=>{
  try{
      const {id,role} = req.params;
      let leaves;
      if(role === 'admin'){
       leaves = await Leave.find({employeeId: id});
      }
      else{   //if(!leaves || leaves.length === 0)
        const employee = await Employee.findOne({userId: id})
        leaves = await Leave.find({employeeId: employee._id})
      }
      return res.status(200).json({success:true, leaves});
  }
  catch(error){
    console.error( error.message);
    return res.status(500).json({success:false, error: "leave add Server Error"});
  }
}

const getLeaves = async(req,res)=>{
  
   try{
      const leaves = await Leave.find().populate({
        path: 'employeeId',
        populate: [
          {
           path: 'department',
           select: 'dep_name' 
          },
          {
            path: 'userId',
            select: 'name'
          }

        ] 
      })
     
      return res.status(200).json({success:true, leaves});
   }
   catch(error){
    console.error("Error in getLeaves:", error);
    return res.status(500).json({success:false, error: "leaves add  Server Error"});
   }
   
}




const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name profileImage',
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave not found' });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error in getLeaveDetail:", error);
    return res.status(500).json({ success: false, error: "Leave detail server error" });
  }
};





const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave not found' });
    }

    leave.status = status;
    await leave.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in updateLeave:', error);
    return res.status(500).json({ success: false, error: 'Update leave server error' });
  }
};


export {addLeave,getLeave,getLeaves,getLeaveDetail,updateLeave,adminAddLeave}