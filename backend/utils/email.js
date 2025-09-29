// File: backend/utils/email.js

import * as Brevo from "@brevo/client";
import { welcomeTemplate } from "./emailTemplates/welcomeTemplate.js";
import { newBookingTeacher, newBookingStudent } from "./emailTemplates/newBookingTemplate.js";
import { sessionConfirmedTemplate } from "./emailTemplates/sessionConfirmedTemplate.js";
import { sessionCancelledTemplate } from "./emailTemplates/sessionCancelledTemplate.js";
import { payoutProcessedTemplate } from "./emailTemplates/payoutProcessedTemplate.js";
import { newMessageTemplate } from "./emailTemplates/newMessageTemplate.js";
import { passwordResetTemplate } from "./emailTemplates/passwordResetTemplate.js";

// --- Brevo API Client Setup ---
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;
const sendSmtpEmail = new Brevo.SendSmtpEmail();
// --- End of Setup ---

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
      return { subject: "Notification from Privately", htmlContent: `<p>You have a new notification.</p>` };
  }
};

export const sendEmail = async (to, templateName, data) => {
  console.log(`[Email Service API] Attempting to send '${templateName}' email to: ${to}`);
  try {
    const { subject, html } = getEmailTemplate(templateName, data);

    if (!subject || !html) {
      console.error(`[Email Service API] Could not generate email content for template: ${templateName}`);
      return;
    }

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "Privately", email: process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`[Email Service API] Sending email to ${to} with subject: "${subject}"`);

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`[Email Service API] Email sent successfully to ${to}.`);
  } catch (error) {
    // This will now log the detailed error from the Brevo API
    console.error(`[Email Service API] CRITICAL ERROR sending email to ${to}:`, error.response?.body || error.message);
  }
};
