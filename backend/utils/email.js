// File: backend/utils/email.js
// This is a new file.

import nodemailer from "nodemailer";
import { welcomeTemplate } from "./emailTemplates/welcomeTemplate.js";
import { newBookingTeacher, newBookingStudent } from "./emailTemplates/newBookingTemplate.js";
import { sessionConfirmedTemplate } from "./emailTemplates/sessionConfirmedTemplate.js";
import { sessionCancelledTemplate } from "./emailTemplates/sessionCancelledTemplate.js";
import { payoutProcessedTemplate } from "./emailTemplates/payoutProcessedTemplate.js";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
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
    default:
      return { subject: "Notification", html: `<p>${data.message}</p>` };
  }
};

export const sendEmail = async (to, templateName, data) => {
  try {
    const { subject, html } = getEmailTemplate(templateName, data);

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
