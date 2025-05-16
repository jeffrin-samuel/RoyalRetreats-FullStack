const nodemailer = require('nodemailer');

const sendResetPassword = async (email, otp) => {
    
  try {
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL,
              pass: process.env.APP_PASSWORD,
          }
      });

      const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          replyTo: process.env.EMAIL,
          subject: "Password Reset OTP",
          text: `Your OTP for resetting your password is ${otp}.`,
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                  <h2 style="color: #4CAF50;">Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>You have requested to reset your password. Please use the OTP below to proceed:</p>
                  <div style="font-size: 24px; font-weight: bold; color: #333; background: #f0f0f0; padding: 15px 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                      ${otp}
                  </div>
                  <p>This OTP is valid for a limited time. If you did not request a password reset, please ignore this email.</p>
                  <p>Thank you,<br><strong>RoyalRetreats</strong></p>
              </div>
          `
      };

      await transporter.sendMail(mailOptions);
      console.log("Reset password email sent successfully!");
  } catch (error) {
      console.error("Error sending reset password email:", error);
  }
};

module.exports = {sendResetPassword};
