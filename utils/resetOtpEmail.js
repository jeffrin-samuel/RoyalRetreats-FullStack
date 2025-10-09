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
    subject: "MediTrack Password Reset OTP",
    text: `Your OTP for resetting your MediTrack account password is ${otp}.`,
    html: `
        <div style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            max-width: 600px; 
            margin: auto; 
            padding: 20px; 
            border: 1px solid #ccc; 
            border-radius: 10px; 
            background-color: #f9f9f9;
        ">
            <h2 style="color: #007bff; text-align: center;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password for your <strong>MediTrack</strong> account. Use the OTP below to proceed:</p>
            <div style="
                font-size: 24px; 
                font-weight: bold; 
                color: #333; 
                background: #e6f2ff; 
                padding: 15px 20px; 
                text-align: center; 
                border-radius: 8px; 
                margin: 20px 0;
            ">
                ${otp}
            </div>
            <p>This OTP is valid for a limited time. If you did not request a password reset, please ignore this email.</p>
            <p>Stay safe,<br><strong>MediTrack Team</strong></p>
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
