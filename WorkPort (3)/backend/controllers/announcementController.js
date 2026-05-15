import Announcement from "../models/Announcement.js";

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error in getAnnouncements:", error);
    return res.status(500).json({ success: false, error: "Announcement server error" });
  }
};

const addAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const { title, message, priority } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      priority: priority || "Normal",
      createdBy: req.user._id,
    });

    return res.status(200).json({ success: true, announcement });
  } catch (error) {
    console.error("Error in addAnnouncement:", error);
    return res.status(500).json({ success: false, error: "Announcement server error" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: "Announcement not found" });
    }

    return res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    return res.status(500).json({ success: false, error: "Announcement server error" });
  }
};

export { addAnnouncement, deleteAnnouncement, getAnnouncements };
