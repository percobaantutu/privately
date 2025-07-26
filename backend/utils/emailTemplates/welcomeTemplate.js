// File: backend/utils/emailTemplates/welcomeTemplate.js
// This is a new file (and others are similar).

export const welcomeTemplate = (name) => ({
  subject: "Welcome to Privately!",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for registering with Privately. We're excited to have you on board.</p>
        <p>You can now log in to your account and start exploring teachers or setting up your profile.</p>
        <br>
        <p>Best regards,</p>
        <p>The Privately Team</p>
      </div>
    `,
});
