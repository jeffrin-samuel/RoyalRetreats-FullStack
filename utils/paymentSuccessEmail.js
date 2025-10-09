const nodemailer = require('nodemailer');

// Function to send a payment success email with all payment details
const sendPaymentSuccessEmail = async (userEmail, paymentDetails, listingDetails, guestCount, startDate, endDate) => {
  try {
    //Transporter Object
    const transporter = nodemailer.createTransport({
      service: 'gmail', //Gmail Service
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.APP_PASSWORD, 
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: userEmail, // Recipient's email address (provided to the function)
      replyTo: process.env.EMAIL, // Reply-to address (same as the sender's email)
      subject: 'Payment Successful - Booking Confirmation', // Email subject
      text: `Your payment for the booking has been successful. Here are the details: 
      Order ID: ${paymentDetails.orderId}
      Payment ID: ${paymentDetails.paymentId}
      Amount: ${paymentDetails.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Booking Payment Successful</h2>
          <p>Hello,</p>
          <p>We are pleased to inform you that your payment for the booking has been successfully completed. Below are your booking and payment details:</p>
          
          <h3 style="color: #333;">Booking Details:</h3>
          <ul>
            <li><strong>Stay:</strong> ${listingDetails.name}</li>
            <li><strong>Location:</strong> ${listingDetails.location}</li>
            <li><strong>Guests:</strong> ${guestCount} guest(s)</li>
            <li><strong>Booking Dates:</strong> ${startDate} to ${endDate}</li>
          </ul>

          <h3 style="color: #333;">Payment Details:</h3>
          <ul>
            <li><strong>Order ID:</strong> ${paymentDetails.orderId}</li>
            <li><strong>Payment ID:</strong> ${paymentDetails.paymentId}</li>
            <li><strong>Amount Paid:</strong> ₹${paymentDetails.amount / 100} INR</li>
            <li><strong>Payment Status:</strong> Successful</li>
          </ul>

          <p>This email confirms that your booking is now complete, and we look forward to hosting you soon!</p>
          
          <p>If you have any questions or need assistance with your booking, feel free to contact us.</p>
          
          <p>Thank you for choosing <strong>RoyalRetreats</strong>!</p>
        </div>
      `, // HTML content with payment and booking details styled
    };

    // Send the email using the transporter
    await transporter.sendMail(mailOptions);
    console.log("Payment success email sent successfully!");
  } catch (error) {
    console.error("Error sending payment success email:", error);
  }
};

module.exports = { sendPaymentSuccessEmail };
