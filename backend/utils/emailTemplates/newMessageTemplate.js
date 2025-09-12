export const newMessageTemplate = (recipientName, senderName) => ({
  subject: `You have a new message from ${senderName}`,
  html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${recipientName},</h2>
          <p>You have received a new message from <strong>${senderName}</strong> on Privately.</p>
          <p>Please log in to your account to view the message and reply.</p>
          <br>
          <p>Best regards,</p>
          <p>The Privately Team</p>
        </div>
      `,
});
