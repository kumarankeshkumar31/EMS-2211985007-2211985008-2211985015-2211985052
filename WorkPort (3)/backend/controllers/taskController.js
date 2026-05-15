import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-task-" + path.extname(file.originalname));
  },
});

const uploadTaskReport = multer({ storage });

const taskPopulate = [
  {
    path: "employeeId",
    select: "employeeId userId department designation",
    populate: [
      { path: "userId", select: "name email profileImage" },
      { path: "department", select: "dep_name" },
    ],
  },
  { path: "assignedBy", select: "name role" },
];

const getAllTasks = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const tasks = await Task.find().populate(taskPopulate).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

const createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const { title, description, employeeId, priority, dueDate } = req.body;
    if (!title?.trim() || !description?.trim() || !employeeId) {
      return res.status(400).json({
        success: false,
        error: "Title, description, and employee are required",
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const task = await Task.create({
      title,
      description,
      employeeId,
      assignedBy: req.user._id,
      priority: priority || "Medium",
      dueDate: dueDate || undefined,
    });

    const populatedTask = await task.populate(taskPopulate);
    return res.status(200).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Error in createTask:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const tasks = await Task.find({ employeeId: employee._id })
      .populate(taskPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error in getMyTasks:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

const updateTaskProgress = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const task = await Task.findOne({ _id: req.params.id, employeeId: employee._id });
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    if (!["Assigned", "Revision Requested"].includes(task.status)) {
      return res.status(400).json({ success: false, error: "Task cannot be moved now" });
    }

    task.status = "In Progress";
    task.reviewNote = "";
    await task.save();

    const populatedTask = await task.populate(taskPopulate);
    return res.status(200).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Error in updateTaskProgress:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

const submitTask = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const task = await Task.findOne({ _id: req.params.id, employeeId: employee._id });
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload report file" });
    }

    task.status = "Submitted";
    task.reportFile = req.file.filename;
    task.reportNote = req.body.reportNote || "";
    task.reviewNote = "";
    task.submittedAt = new Date();
    await task.save();

    const populatedTask = await task.populate(taskPopulate);
    return res.status(200).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Error in submitTask:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

const reviewTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const { status, reviewNote } = req.body;
    if (!["Completed", "Revision Requested"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid review status" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    task.status = status;
    task.reviewNote = reviewNote || "";
    task.reviewedAt = new Date();
    await task.save();

    const populatedTask = await task.populate(taskPopulate);
    return res.status(200).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Error in reviewTask:", error);
    return res.status(500).json({ success: false, error: "Task server error" });
  }
};

export {
  createTask,
  getAllTasks,
  getMyTasks,
  reviewTask,
  submitTask,
  updateTaskProgress,
  uploadTaskReport,
};
