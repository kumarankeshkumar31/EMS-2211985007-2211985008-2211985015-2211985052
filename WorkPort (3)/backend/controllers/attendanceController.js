import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getDayStart = (date = new Date()) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const getEmployeeForUser = async (userId) => {
  return Employee.findOne({ userId }).populate("department");
};

const markPresent = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user._id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const today = getDayStart();
    const existingAttendance = await Attendance.findOne({ employeeId: employee._id, date: today });
    if (existingAttendance) {
      return res.status(400).json({ success: false, error: "Attendance already marked today" });
    }

    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      status: "Present",
      checkInTime: new Date(),
    });

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Attendance already marked today" });
    }
    console.error("Error in markPresent:", error);
    return res.status(500).json({ success: false, error: "Attendance server error" });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user._id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const today = getDayStart();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayAttendance, history, monthPresent] = await Promise.all([
      Attendance.findOne({ employeeId: employee._id, date: today }),
      Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(30),
      Attendance.countDocuments({
        employeeId: employee._id,
        date: { $gte: monthStart, $lte: today },
      }),
    ]);

    return res.status(200).json({
      success: true,
      employee,
      todayAttendance,
      history,
      monthPresent,
    });
  } catch (error) {
    console.error("Error in getMyAttendance:", error);
    return res.status(500).json({ success: false, error: "Attendance server error" });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const today = getDayStart();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [records, todayRecords, monthPresent, employees, leaveToday] = await Promise.all([
      Attendance.find()
        .populate({
          path: "employeeId",
          select: "employeeId userId department designation",
          populate: [
            { path: "userId", select: "name email profileImage" },
            { path: "department", select: "dep_name" },
          ],
        })
        .sort({ date: -1, checkInTime: -1 })
        .limit(200),
      Attendance.find({ date: { $gte: today, $lt: tomorrow } }).select("employeeId"),
      Attendance.countDocuments({ date: { $gte: monthStart, $lt: tomorrow } }),
      Employee.find()
        .select("employeeId userId department designation")
        .populate("userId", "name email profileImage")
        .populate("department", "dep_name"),
      Leave.find({
        status: "Approved",
        startDate: { $lte: tomorrow },
        endDate: { $gte: today },
      }).populate({
        path: "employeeId",
        select: "employeeId userId department designation",
        populate: [
          { path: "userId", select: "name email profileImage" },
          { path: "department", select: "dep_name" },
        ],
      }),
    ]);

    const presentEmployeeIds = new Set(
      todayRecords.map((record) => record.employeeId.toString())
    );
    const leaveEmployeeIds = new Set(
      leaveToday
        .filter((leave) => leave.employeeId)
        .map((leave) => leave.employeeId._id.toString())
    );
    const absentToday = employees.filter(
      (employee) =>
        !presentEmployeeIds.has(employee._id.toString()) &&
        !leaveEmployeeIds.has(employee._id.toString())
    );

    return res.status(200).json({
      success: true,
      records,
      absentToday,
      leaveToday,
      summary: {
        totalEmployees: employees.length,
        todayPresent: todayRecords.length,
        todayAbsent: absentToday.length,
        todayOnLeave: leaveToday.length,
        monthPresent,
      },
    });
  } catch (error) {
    console.error("Error in getAllAttendance:", error);
    return res.status(500).json({ success: false, error: "Attendance server error" });
  }
};

export { markPresent, getMyAttendance, getAllAttendance };
