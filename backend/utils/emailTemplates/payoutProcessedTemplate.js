// File: backend/utils/emailTemplates/payoutProcessedTemplate.js

export const payoutProcessedTemplate = (teacherName, amount) => ({
  subject: "Your Payout has been Processed!",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${teacherName},</h2>
        <p>Your recent payout for the amount of <strong>Rp ${new Intl.NumberFormat("id-ID").format(amount)}</strong> has been processed by our team.</p>
        <p>The funds should reflect in your registered bank account within 1-3 business days.</p>
        <br>
        <p>Thank you for teaching with us!</p>
        <p>The Privately Team</p>
      </div>
    `,
});
