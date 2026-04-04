const nodemailer = require('nodemailer');

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a verification email to the newly registered user.
 * 
 * @param {string} toEmail - The recipient's email address
 * @param {string} token - The unique verification token
 */
const sendVerificationEmail = async (toEmail, token) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const confirmationLink = `${frontendUrl}/confirm-email?token=${token}`;

    const mailOptions = {
      from: `"MindBloom" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Confirm your MindBloom signup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to MindBloom!</h2>
          <p>We're excited to have you join our community. Please confirm your email address to complete your registration.</p>
          <a href="${confirmationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Verify My Email
          </a>
          <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
            If the button doesn't work, you can copy and paste this link deeply into your browser: <br/>
            ${confirmationLink}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
