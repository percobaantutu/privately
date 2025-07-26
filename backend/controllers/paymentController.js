import crypto from "crypto";
import Session from "../models/Session.js";
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/email.js"; // IMPORT THE EMAIL UTILITY

export const paymentWebhook = async (req, res) => {
  try {
    const notificationJson = req.body;

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

    // --- MODIFIED: Populate teacher and student details for email ---
    const session = await Session.findById(sessionId).populate("teacherId", "fullName email").populate("studentId", "fullName email");
    // ----------------------------------------------------------------

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    if (transactionStatus == "capture" || transactionStatus == "settlement") {
      if (fraudStatus == "accept") {
        session.paymentStatus = "paid";
        session.status = "pending_confirmation";
        await session.save();

        await createNotification(session.teacherId, "new_booking", `${session.studentId.fullName} has booked and paid for a session. Please confirm.`, "/teacher/dashboard/sessions");

        // --- ADDED: Send emails ---
        // Email to Teacher
        await sendEmail(session.teacherId.email, "new_booking_teacher", {
          teacherName: session.teacherId.fullName,
          studentName: session.studentId.fullName,
          sessionDate: new Date(session.date).toLocaleDateString(),
        });

        // Email to Student
        await sendEmail(session.studentId.email, "new_booking_student", {
          studentName: session.studentId.fullName,
          teacherName: session.teacherId.fullName,
          sessionDate: new Date(session.date).toLocaleDateString(),
        });
        // -------------------------
      }
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      session.paymentStatus = "failed";
      session.status = "cancelled";
      await session.save();
    }

    res.status(200).send("Webhook received successfully.");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
};
