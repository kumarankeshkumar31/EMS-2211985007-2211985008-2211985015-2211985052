import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Leave from '../models/Leave.js';

const getSummary = async (req, res) => {
  try {
    // Total employees and departments
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    // Total salary
    const totalSalaryResult = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
    ]);
    const totalSalary = totalSalaryResult[0]?.totalSalary || 0;

    // Total employees who applied for leave
    const employeeAppliedForLeave = await Leave.distinct('employeeId');

    // Leave status counts
    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === 'Approved')?.count || 0,
      rejected: leaveStatus.find(item => item._id === 'Rejected')?.count || 0,
      pending: leaveStatus.find(item => item._id === 'Pending')?.count || 0,
    };

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary,
      leaveSummary
    });

  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    return res.status(500).json({ success: false, error: "Dashboard summary server error" });
  }
};

export { getSummary };
