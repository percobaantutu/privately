// File: backend/utils/emailTemplates/sessionConfirmedTemplate.js

export const sessionConfirmedTemplate = (studentName, teacherName, sessionDate, sessionLink) => ({
  subject: "Your Session is Confirmed!",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${studentName},</h2>
        <p>Great news! Your session with <strong>${teacherName}</strong> for <strong>${sessionDate}</strong> has been confirmed.</p>
        <p>You can join the session using the link below:</p>
        <a href="${sessionLink}" style="display: inline-block; padding: 10px 20px; background-color: #00b4d8; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Join Session</a>
        <p>If the button doesn't work, copy and paste this link into your browser: ${sessionLink}</p>
        <br>
        <p>We hope you have a great session!</p>
        <p>The Privately Team</p>
      </div>
    `,
});
