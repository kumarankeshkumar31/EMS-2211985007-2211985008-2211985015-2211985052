import ChatMessage from "../models/ChatMessage.js";
import Employee from "../models/Employee.js";

const getEmployeeUserId = (req, requestedEmployeeUserId) => {
  if (req.user.role === "employee") return req.user._id;
  return requestedEmployeeUserId;
};

const getConversation = async (req, res) => {
  try {
    const employeeUserId = getEmployeeUserId(req, req.params.employeeUserId);
    if (!employeeUserId) {
      return res.status(400).json({ success: false, error: "Employee user id is required" });
    }

    const messages = await ChatMessage.find({ employeeUserId })
      .populate("senderId", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getConversation:", error);
    return res.status(500).json({ success: false, error: "Chat server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, employeeUserId: requestedEmployeeUserId } = req.body;
    const cleanMessage = message?.trim();

    if (!cleanMessage) {
      return res.status(400).json({ success: false, error: "Message cannot be empty" });
    }

    const employeeUserId = getEmployeeUserId(req, requestedEmployeeUserId);
    if (!employeeUserId) {
      return res.status(400).json({ success: false, error: "Employee user id is required" });
    }

    const chatMessage = await ChatMessage.create({
      employeeUserId,
      senderId: req.user._id,
      senderRole: req.user.role,
      message: cleanMessage,
    });

    const populatedMessage = await chatMessage.populate("senderId", "name role");
    return res.status(200).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ success: false, error: "Chat server error" });
  }
};

const getAdminConversations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const employees = await Employee.find()
      .select("employeeId userId department designation")
      .populate("userId", "name email profileImage")
      .populate("department", "dep_name");

    const messages = await ChatMessage.find().sort({ createdAt: -1 });
    const latestByEmployee = new Map();
    const countsByEmployee = new Map();

    messages.forEach((message) => {
      const key = message.employeeUserId.toString();
      if (!latestByEmployee.has(key)) latestByEmployee.set(key, message);
      countsByEmployee.set(key, (countsByEmployee.get(key) || 0) + 1);
    });

    const conversations = employees
      .map((employee) => {
        const key = employee.userId?._id?.toString();
        return {
          employee,
          latestMessage: latestByEmployee.get(key) || null,
          messageCount: countsByEmployee.get(key) || 0,
        };
      })
      .sort((a, b) => {
        const aTime = a.latestMessage?.createdAt || 0;
        const bTime = b.latestMessage?.createdAt || 0;
        return new Date(bTime) - new Date(aTime);
      });

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Error in getAdminConversations:", error);
    return res.status(500).json({ success: false, error: "Chat server error" });
  }
};

export { getAdminConversations, getConversation, sendMessage };
