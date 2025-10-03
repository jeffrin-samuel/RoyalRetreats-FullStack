# RoyalRetreats

An Airbnb-inspired full-stack vacation rental platform built with Node.js, Express.js, MongoDB, EJS, HTML, CSS, Bootstrap & JavaScript. RoyalRetreats offers seamless property listings, bookings, wishlists, 
user authentication/authorization, automated email notifications powered by Nodemailer & secure payment integration using Razorpay.

---

## 🚀 Features

- User authentication & session management with Passport.js
- Secure password hashing and validation using passport-local-mongoose and Joi
- Full CRUD operations for property listings
- Smart filters to sort properties by price and category
- Wishlist functionality to save favorite listings
- Booking system with payment integration via Razorpay
- Booking button disables and turns green after successful booking to avoid duplicates
- Owners cannot book or wishlist their own properties
- Automated email notifications using Nodemailer for registration, OTP, and bookings
- Image uploads handled by Multer and Cloudinary
- Fully responsive design for desktop and mobile
- Robust error handling and session support

---

## 💻 Tech Stack

- Backend: Node.js, Express.js, MongoDB
- Frontend: HTML, CSS, EJS, Bootstrap, JavaScript
- Authentication: Passport.js with passport-local-mongoose
- Validation: Joi for both client-side and server-side
- File Upload: Multer + Cloudinary
- Payment Gateway: Razorpay
- Email Service: Nodemailer
- Deployment: Render with MongoDB Atlas

---

## Project Structure

ROYALRETREATS/
│
├── controllers/
├── init/
├── models/
├── node_modules/
├── public/
├── routes/
├── uploads/
├── utils/
├── views/
├── .env
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package-lock.json
├── package.json
└── schema.js

## Testing Payments with Razorpay

You can use the following Razorpay test card details to simulate payments in the development/test environment:

- **Card Number:** 4111 1111 1111 1111  
- **Expiry:** Any future date in MM/YY format (e.g., 12/34)
- **CVV:** 123  
- **Name:** Test User (any name)  
- **Email:** test@example.com (any email)  
- **OTP:** Any 4-8 digit number (e.g., 123456)  

> Note: This card only works in Razorpay’s test mode and do not process real payments.


## About This Project

This full-stack project is developed for personal learning and demonstration purposes only.


## Connect with me

Feel free to connect with me:

- GitHub: [jeffrin-samuel](https://github.com/jeffrin-samuel)  
- LinkedIn: [Jeffrin Samuel](https://www.linkedin.com/in/jeffrin-samuel-236452210/)  
- Email: [jeffrinsamuel2006@gmail.com](mailto:jeffrinsamuel2006@gmail.com)

