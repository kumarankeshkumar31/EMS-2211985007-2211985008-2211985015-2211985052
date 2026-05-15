import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Assigned", "In Progress", "Submitted", "Completed", "Revision Requested"],
    default: "Assigned",
  },
  dueDate: {
    type: Date,
  },
  reportFile: {
    type: String,
  },
  reportNote: {
    type: String,
  },
  reviewNote: {
    type: String,
  },
  submittedAt: {
    type: Date,
  },
  reviewedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
