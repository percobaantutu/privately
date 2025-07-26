// File: backend/utils/emailTemplates/newBookingTemplate.js

export const newBookingTeacher = (teacherName, studentName, sessionDate) => ({
  subject: "New Session Booking Request!",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${teacherName},</h2>
        <p>You have a new session request from <strong>${studentName}</strong> for <strong>${sessionDate}</strong>.</p>
        <p>The student has completed their payment. Please log in to your dashboard to confirm the session and provide the meeting link.</p>
        <br>
        <p>Best regards,</p>
        <p>The Privately Team</p>
      </div>
    `,
});

export const newBookingStudent = (studentName, teacherName, sessionDate) => ({
  subject: "Your Session is Awaiting Confirmation",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${studentName},</h2>
        <p>Your payment has been successfully processed for your session with <strong>${teacherName}</strong> on <strong>${sessionDate}</strong>.</p>
        <p>We have notified the teacher. You will receive another email with the session link as soon as they confirm the booking.</p>
        <br>
        <p>Best regards,</p>
        <p>The Privately Team</p>
      </div>
    `,
});
