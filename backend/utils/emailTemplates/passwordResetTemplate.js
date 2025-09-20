export const passwordResetTemplate = (name, resetLink) => ({
  subject: "Your Password Reset Request",
  html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${name},</h2>
          <p>You recently requested to reset your password for your Privately account. Click the button below to reset it.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #00b4d8; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Your Password</a>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>This link is valid for 15 minutes.</p>
          <br>
          <p>Thanks,</p>
          <p>The Privately Team</p>
        </div>
      `,
});
