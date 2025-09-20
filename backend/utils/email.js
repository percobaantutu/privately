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
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    // ADD THE NEW CASE FOR MESSAGES
    case "new_message":
      return newMessageTemplate(data.recipientName, data.senderName);
    case "password_reset":
      return passwordResetTemplate(data.name, data.resetLink);
    default:
      // Return a default or null if no template is found
      console.warn(`Email template "${templateName}" not found.`);
      return { subject: "Notification from Privately", html: `<p>You have a new notification.</p>` };
  }
};

export const sendEmail = async (to, templateName, data) => {
  try {
    const { subject, html } = getEmailTemplate(templateName, data);

    if (!subject || !html) {
      console.error(`Could not generate email content for template: ${templateName}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};
