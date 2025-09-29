// File: backend/utils/email.js

import nodemailer from "nodemailer";
import { welcomeTemplate } from "./emailTemplates/welcomeTemplate.js";
import { newBookingTeacher, newBookingStudent } from "./emailTemplates/newBookingTemplate.js";
import { sessionConfirmedTemplate } from "./emailTemplates/sessionConfirmedTemplate.js";
import { sessionCancelledTemplate } from "./emailTemplates/sessionCancelledTemplate.js";
import { payoutProcessedTemplate } from "./emailTemplates/payoutProcessedTemplate.js";
import { newMessageTemplate } from "./emailTemplates/newMessageTemplate.js";
import { passwordResetTemplate } from "./emailTemplates/passwordResetTemplate.js";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add this for better debugging
  logger: true,
  debug: true,
});

const getEmailTemplate = (templateName, data) => {
  switch (templateName) {
    case "welcome":
      return welcomeTemplate(data.name);
    case "new_booking_teacher":
      return newBookingTeacher(data.teacherName, data.studentName, data.sessionDate);
    case "new_booking_student":
      return newBookingStudent(data.studentName, data.teacherName, data.sessionDate);
    case "session_confirmed":
      return sessionConfirmedTemplate(data.studentName, data.teacherName, data.sessionDate, data.sessionLink);
    case "session_cancelled":
      return sessionCancelledTemplate(data.recipientName, data.cancellerName, data.sessionDate, data.reason);
    case "payout_processed":
      return payoutProcessedTemplate(data.teacherName, data.amount);
    case "new_message":
      return newMessageTemplate(data.recipientName, data.senderName);
    case "password_reset":
      return passwordResetTemplate(data.name, data.resetLink);
    default:
      console.warn(`Email template "${templateName}" not found.`);
      return { subject: "Notification from Privately", html: `<p>You have a new notification.</p>` };
  }
};

export const sendEmail = async (to, templateName, data) => {
  console.log(`[Email Service] Attempting to send '${templateName}' email to: ${to}`);
  try {
    const { subject, html } = getEmailTemplate(templateName, data);

    if (!subject || !html) {
      console.error(`[Email Service] Could not generate email content for template: ${templateName}`);
      return;
    }

    const mailOptions = {
      from: `Privately <${process.env.EMAIL_FROM}>`, // Using a name + email format
      to,
      subject,
      html,
    };

    console.log("[Email Service] Sending mail with options:", { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
  } catch (error) {
    // This will now log the detailed error from Nodemailer/Brevo
    console.error(`[Email Service] CRITICAL ERROR sending email to ${to}:`, error);
  }
};
