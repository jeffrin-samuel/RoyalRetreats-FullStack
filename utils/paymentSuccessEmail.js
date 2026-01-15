const nodemailer = require("nodemailer");

// Send booking confirmation email after successful payment
const sendPaymentSuccessEmail = async (
  userEmail,
  paymentDetails,
  listingDetails,
  guestCount,
  startDate,
  endDate
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const imageUrl = listingDetails.image?.url; // Cloudinary public URL

    const mailOptions = {
      from: `RoyalRetreats <${process.env.EMAIL}>`,
      to: userEmail,
      replyTo: process.env.EMAIL,
      subject: "Booking confirmed · RoyalRetreats",
      text: `Your booking is confirmed!

Stay: ${listingDetails.title}
Location: ${listingDetails.location}
Guests: ${guestCount}
Dates: ${startDate} to ${endDate}

Payment Summary:
Payment ID: ${paymentDetails.paymentId}
Amount Paid: ₹${paymentDetails.amount / 100}

Thank you for booking with RoyalRetreats.
We look forward to hosting you!

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

            <!-- Image -->
            ${
              imageUrl
                ? `
              <div style="padding:16px 32px 0 32px;">
                <a href="https://royalretreats-fullstack.onrender.com/listings/${listingDetails._id}"
                  style="text-decoration:none;display:block;">
                  
                  <div style="
                    width:100%;
                    aspect-ratio:16/9;
                    background:#f1f1f1;
                    border-radius:10px;
                    overflow:hidden;
                  ">
                    <img 
                      src="${imageUrl}"
                      alt="Booked property"
                      style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        object-position:center;
                        display:block;
                      "
                    />
                  </div>

                </a>
              </div>
            `
                : ""
            }


            <!-- View Bookings Button -->
            <div style="margin:24px 32px 0 32px;text-align:center;">
              <a
                href="https://royalretreats-fullstack.onrender.com/booked-trips"
                style="
                  display:inline-block;
                  background-color:#FF385C;
                  color:#ffffff;
                  text-decoration:none;
                  padding:12px 24px;
                  border-radius:8px;
                  font-size:14px;
                  font-weight:600;
                "
              >
                View your bookings
              </a>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
              <h2 style="margin-top:0;font-size:20px;color:#222;">
                  Booking confirmed
              </h2>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                Your reservation has been successfully confirmed.
                Below are the details of your stay.
              </p>

              <!-- Stay Details -->
              <div style="margin-top:24px;">
                <h3 style="font-size:16px;color:#222;margin-bottom:8px;">
                  Stay details
                </h3>

                <table style="width:100%;font-size:14px;color:#555;">
                  <tr>
                    <td><strong>Property</strong></td>
                    <td>${listingDetails.title}</td>
                  </tr>
                  <tr>
                    <td><strong>Location</strong></td>
                    <td>${listingDetails.location}</td>
                  </tr>
                  <tr>
                    <td><strong>Guests</strong></td>
                    <td>${guestCount}</td>
                  </tr>
                  <tr>
                    <td><strong>Dates</strong></td>
                    <td>${startDate} → ${endDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Payment Summary -->
              <div style="margin-top:24px;">
                <h3 style="font-size:16px;color:#222;margin-bottom:8px;">
                  Payment summary
                </h3>

                <table style="width:100%;font-size:14px;color:#555;">
                  <tr>
                    <td><strong>Payment ID</strong></td>
                    <td>${paymentDetails.paymentId}</td>
                  </tr>
                  <tr>
                    <td><strong>Amount paid</strong></td>
                    <td>₹${paymentDetails.amount / 100}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>Successful</td>
                  </tr>
                </table>
              </div>

              <p style="margin-top:24px;font-size:14px;color:#777;">
                If you have any questions regarding your booking,
                simply reply to this email.
              </p>

              <p style="margin-top:16px;font-size:14px;color:#777;">
                We look forward to hosting you.<br>
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
    console.log("Booking confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};

module.exports = { sendPaymentSuccessEmail };
