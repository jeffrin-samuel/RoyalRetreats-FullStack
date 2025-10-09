const nodemailer = require('nodemailer');


const sendWelcomeEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,      // Use your email from .env
                pass: process.env.APP_PASSWORD // Use your app password from .env
            }
        });

        const mailOptions = {
            from: process.env.EMAIL, // Sender's email from .env
            to: email, // Recipient's email (new user)
            replyTo: process.env.EMAIL, 
            subject: "Welcome to RoyalRetreats!",
            text: "Thank you for signing up! We're excited to have you on board.", // Simple text fallback
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Welcome to RoyalRetreats!</h2>
                    <p>We're thrilled to have you join us. Get ready for amazing travel experiences!</p>
                    <p>Stay tuned for updates and exclusive offers!</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>RoyalRetreats Team</strong></p>
                </div>
            ` // More visually appealing HTML version ( Added html field → Emails with only plain text often get flagged as spam)
        };
        
        

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = {sendWelcomeEmail};