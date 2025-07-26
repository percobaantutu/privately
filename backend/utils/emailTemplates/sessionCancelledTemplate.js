// File: backend/utils/emailTemplates/sessionCancelledTemplate.js

export const sessionCancelledTemplate = (recipientName, cancellerName, sessionDate, reason) => ({
  subject: "A Session Has Been Cancelled",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${recipientName},</h2>
        <p>This is a notification that your session with <strong>${cancellerName}</strong> scheduled for <strong>${sessionDate}</strong> has been cancelled.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <br>
        <p>Please check your account for more details regarding refunds or rescheduling.</p>
        <p>The Privately Team</p>
      </div>
    `,
});
