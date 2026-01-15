const nodemailer = require("nodemailer");

const sendResetPassword = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `RoyalRetreats <${process.env.EMAIL}>`,
      to: email,
      replyTo: process.env.EMAIL,
      subject: "Reset your RoyalRetreats password",
      text: `You requested a password reset for your RoyalRetreats account.

Your OTP is: ${otp}

This OTP is valid for 1 hour.
If you didn’t request a password reset, you can safely ignore this email.

— RoyalRetreats Team`,

      html: `
        <div style="background-color:#f7f7f7;padding:30px 0;
                    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;
                      border-radius:12px;overflow:hidden;
                      box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="padding:24px 32px;border-bottom:1px solid #eee;">
              <h1 style="margin:0;font-size:22px;color:#FF385C;">RoyalRetreats</h1>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
              <h2 style="margin-top:0;font-size:20px;color:#222;">
                Password reset requested
              </h2>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                We received a request to reset the password for your
                <strong>RoyalRetreats</strong> account.
              </p>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                Use the OTP below to continue:
              </p>

              <!-- OTP Box -->
              <div style="margin:24px 0;text-align:center;">
                <div style="display:inline-block;
                            padding:14px 28px;
                            font-size:22px;
                            letter-spacing:2px;
                            font-weight:600;
                            color:#222;
                            background:#f2f2f2;
                            border-radius:8px;">
                  ${otp}
                </div>
              </div>

              <p style="font-size:14px;color:#777;line-height:1.6;">
                This OTP is valid for <strong>1 hour</strong>.
                If you did not request a password reset, you can safely ignore this email.
              </p>

              <p style="margin-top:24px;font-size:14px;color:#777;">
                Regards,<br>
                <strong>RoyalRetreats Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="padding:16px 32px;background:#fafafa;
                        border-top:1px solid #eee;
                        font-size:12px;color:#999;text-align:center;">
              © ${new Date().getFullYear()} RoyalRetreats. All rights reserved.
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent successfully!");
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

module.exports = { sendResetPassword };
