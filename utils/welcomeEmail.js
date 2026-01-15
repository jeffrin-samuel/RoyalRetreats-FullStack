const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (email) => {
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
      subject: "Welcome to RoyalRetreats",
      text: `Welcome to RoyalRetreats!

We're excited to have you on board. Start exploring unique stays and unforgettable travel experiences.

Happy traveling,
RoyalRetreats Team`,

      html: `
        <div style="background-color:#f7f7f7;padding:30px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="padding:24px 32px;border-bottom:1px solid #eee;">
              <h1 style="margin:0;font-size:22px;color:#FF385C;">RoyalRetreats</h1>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
              <h2 style="margin-top:0;font-size:20px;color:#222;">Welcome aboard</h2>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                Thanks for signing up with <strong>RoyalRetreats</strong>.
                You're now ready to explore hand-picked stays, curated experiences
                and memorable journeys.
              </p>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                Start browsing listings, save your favorites and plan your next getaway with ease.
              </p>

              <div style="margin:32px 0;text-align:center;">
                <a href="https://royalretreats-fullstack.onrender.com/listings"
                   style="display:inline-block;background:#FF385C;color:#ffffff;
                          text-decoration:none;padding:12px 22px;border-radius:8px;
                          font-weight:600;font-size:14px;">
                  Explore Listings
                </a>
              </div>

              <p style="font-size:14px;color:#777;line-height:1.6;">
                If you ever need help, just reply to this email — we’re happy to assist.
              </p>

              <p style="margin-top:24px;font-size:14px;color:#777;">
                Warm regards,<br>
                <strong>RoyalRetreats Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="padding:16px 32px;background:#fafafa;border-top:1px solid #eee;
                        font-size:12px;color:#999;text-align:center;">
              © ${new Date().getFullYear()} RoyalRetreats. All rights reserved.
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = { sendWelcomeEmail };
