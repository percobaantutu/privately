import crypto from "crypto";
import Session from "../models/Session.js";
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js";

export const paymentWebhook = async (req, res) => {
  try {
    const notificationJson = req.body;

    // 1. Verify the webhook signature (for security)
    const signatureKey = crypto
      .createHash("sha512")
      .update(notificationJson.order_id + notificationJson.status_code + notificationJson.gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest("hex");
    if (signatureKey !== notificationJson.signature_key) {
      return res.status(403).json({ success: false, message: "Invalid signature." });
    }

    const sessionId = notificationJson.order_id;
    const transactionStatus = notificationJson.transaction_status;
    const fraudStatus = notificationJson.fraud_status;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    // 2. Update session based on payment status
    if (transactionStatus == "capture" || transactionStatus == "settlement") {
      if (fraudStatus == "accept") {
        // Payment is successful and secure
        session.paymentStatus = "paid";
        session.status = "pending_confirmation"; // Now it waits for teacher confirmation
        await session.save();

        // Notify the teacher about the new booking request
        const student = await User.findById(session.studentId);
        await createNotification(session.teacherId, "new_booking", `${student.fullName} has booked and paid for a session. Please confirm.`, "/teacher/dashboard/sessions");
      }
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      // Payment failed or was cancelled
      session.paymentStatus = "failed";
      session.status = "cancelled"; // Or a new status like 'payment_failed'
      await session.save();
    }

    // 3. Respond to the gateway
    res.status(200).send("Webhook received successfully.");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
};
