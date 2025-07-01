// backend/controllers/notificationController.js

import Notification from "../models/Notification.js";

export const createNotification = async (userId, type, message, link) => {
  try {
    if (!userId) {
      console.error("Notification creation skipped: No userId provided.");
      return;
    }
    const notification = new Notification({
      userId,
      type,
      message,
      link,
    });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching notifications." });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate({ _id: notificationId, userId: req.user._id }, { isRead: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }
    res.status(200).json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
