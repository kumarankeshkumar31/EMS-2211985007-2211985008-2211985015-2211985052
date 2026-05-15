import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

// Add Salary
const addSalary = async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions } = req.body;

        // Find Employee by employeeId string
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

        const newSalary = new Salary({
            employeeId: employee._id,
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate:Date.now()
        });

        await newSalary.save();

        return res.status(200).json({ success: true, message: "Salary added successfully" });
    } catch (error) {
        console.error("Error in addSalary:", error);
        return res.status(500).json({ success: false, error: "Add salary server error" });
    }
};

// Get Salary
const getSalary = async (req, res) => {
    try {
        const { id, role } = req.params;
        let salary;

        if (role === "admin") {
            salary = await Salary.find().populate({
                path: "employeeId",
                select: "employeeId userId",
                populate: { path: "userId", select: "name email" }
            });
        } else {
            const employee = await Employee.findOne({ userId: id });
            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            salary = await Salary.find({ employeeId: employee._id }).populate({
                path: "employeeId",
                select: "employeeId userId",
                populate: { path: "userId", select: "name email" }
            });
        }

        return res.status(200).json({ success: true, salary });
    } catch (error) {
        console.error("Error in getSalary:", error);
        return res.status(500).json({ success: false, error: "Get salary server error" });
    }
};

export { addSalary, getSalary };
