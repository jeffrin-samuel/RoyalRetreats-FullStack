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
    subject: "Welcome to MediTrack!",
    text: "Thank you for signing up! MediTrack will help you manage hospital resources efficiently.", // Plain text fallback
    html: `
        <div style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px;
        ">
            <h2 style="color: #007bff;">Welcome to MediTrack!</h2>
            <p>Dear user,</p>
            <p>We're excited to have you on board. MediTrack is designed to help hospitals, NGOs, and government agencies efficiently track and manage emergency medical resources in real-time.</p>
            <p>With MediTrack, you can:</p>
            <ul>
                <li>Monitor hospital beds, oxygen, medicines, and other critical resources.</li>
                <li>Track patient admissions and referrals.</li>
                <li>Receive instant alerts for shortages or emergencies.</li>
                <li>Generate reports and analytics for better decision-making.</li>
            </ul>
            <p>Thank you for joining us. Together, we can save lives and ensure efficient resource management!</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>MediTrack Team</strong></p>
        </div>
    `
};

        
        

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = {sendWelcomeEmail};