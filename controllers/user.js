require("dotenv").config();

const User = require("../models/user.js");
const mongoose = require("mongoose");

const { sendResetPassword } = require("../utils/resetOtpEmail.js"); 
const { sendWelcomeEmail } = require("../utils/welcomeEmail.js");

// Add or remove listing from wishlist
module.exports.Wishlists = async (req, res) => {
    const listingId = req.params.id;

    if (!req.user) {
        req.flash("error", "User not found.");
        return res.redirect(`/listings/${listingId}`);
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect(`/listings/${listingId}`);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect(`/listings/${listingId}`);
    }

    const index = user.wishlist.indexOf(listingId);

    if (index === -1) {
        user.wishlist.push(listingId);
        req.flash("success", "Added to wishlist!");
        await user.save();
        return res.redirect(`/listings/${listingId}`);
    } else {
        user.wishlist.splice(index, 1);
        req.flash("success", "Removed from wishlist.");
        await user.save();
        return res.redirect(`/listings/${listingId}`);
    }
};

// Render Wishlist Page
module.exports.renderWishlists = async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
        return res.render("users/wishlist.ejs", { allListings: [], message: "User not found" });
    }
    res.render("users/wishlist.ejs", { allListings: user.wishlist });
};

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup Callback
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

    /* Send welcome email only in non-production environments (eg. localhost) 
   to avoid SMTP/port issues on Render during deployment */
        if(process.env.NODE_ENV != "production"){
        await sendWelcomeEmail(registeredUser.email);
        }

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to RoyalRetreats!");
            res.redirect("/listings");
        });
    } catch (e) {
        if (e.code === 11000) {
            req.flash("error", "Email already registered.");
        } else {
            req.flash("error", e.message);
        }
        res.redirect("/signup");
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Login Callback
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to RoyalRetreats!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Logout Callback
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};

// Profile Page
module.exports.profile = (req, res) => {
    res.render("users/profile.ejs");
};

// Render Profile Edit Form
module.exports.renderEditForm = (req, res) => {
    res.render("users/edit.ejs");
};

// Update Profile
module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedFields = {
            username: username.trim(),
            email: email.trim(),
        };

        await User.findByIdAndUpdate(req.user._id, updatedFields, {
            runValidators: true,
            new: true,
        });

        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    } catch (err) {
        if (err.code === 11000) {
            req.flash("error", "Email or username already exists!");
            res.redirect("/profile/edit");
        } else {
            console.error(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/profile/edit");
        }
    }
};

// Render OTP Request Form
module.exports.renderOtpForm = (req, res) => {
    res.render("users/reset.ejs");
};

// Send OTP to User Email
module.exports.sendResetOtp = async (req, res) => {
    const { email } = req.body;

    // Clear any existing password reset session state before starting a new OTP flow
    if (req.session.resetUserId) delete req.session.resetUserId;


    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "User not found! Please enter a valid email");
            return res.redirect("/login/reset");
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiry

        await user.save();

/* Intentionally skip sending OTP email in production due to SMTP port restrictions on Render.
   The OTP is still generated and saved in the database so the user can use it once email
   functionality becomes available or is tested locally. */

        if(process.env.NODE_ENV == "production"){
          req.flash("error", "OTP generated! Email delivery is limited on the live demo");
          return res.redirect("/login/reset");
        }

        await sendResetPassword(user.email, otp);
        req.flash("success", "OTP sent to your email!");
        res.redirect("/login/reset/verify");

    } catch (err) {
        console.error(err);
        req.flash("error", "Error sending OTP.");
        res.redirect("/login/reset");
    }
};

// Render OTP Verification Form
module.exports.renderOTPVerify = (req, res) => {
    res.render("users/verifyOtp.ejs");
};

// Verify OTP
module.exports.OTPVerify = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ resetOtp: otp });

        if (!user) { // Invalid OTP (user existence was already validated during OTP request)
          req.flash('error', 'Invalid OTP!');
          return res.redirect('/login/reset/verify');
        }

        // Check if the OTP has expired
        if (user.resetOtpExpireAt < Date.now()) {
        req.flash('error', 'OTP has expired!');
        return res.redirect('/login/reset/verify');
        }
        
        req.session.resetUserId = user._id; // Store OTP-verified user for password reset
        res.redirect("/login/reset/new");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error verifying OTP.");
        res.redirect("/login/reset/verify");
    }
};

// Render New Password Form
module.exports.renderNewPassForm = (req, res) => {
    res.render("users/newPassword.ejs");
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    try {
        if (newPassword !== confirmPassword) {
            req.flash("error", "Passwords do not match!");
            return res.redirect("/login/reset/new");
        }

        const user = await User.findById(req.session.resetUserId); // User identity comes from session, not client input

        // Safety check: user should exist after OTP verification
        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/login/reset/new");
        }

        user.setPassword(newPassword, async (err) => {
            if (err) {
                console.error(err);
                req.flash("error", "Error resetting password.");
                return res.redirect("/login/reset/new");
            }

            user.resetOtp = "";
            user.resetOtpExpireAt = 0;

            await user.save();

            delete req.session.resetUserId; // Clear OTP verification state after successful password reset

            req.flash("success", "Password reset successful! Please log in.");
            res.redirect("/login");
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/login/reset/new");
    }
};

//Render Booked Trips

module.exports.renderTrips = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookings.listing"); //Don't forget to populate since the user.bookings contain only ID's

  if (!user) {
    return res.render("users/bookedTrips.ejs", { bookings: [], message: "User not found." });
  }

// This check on the frontend helps avoid showing deleted listings in bookings
// However, the backend already removes them when a listing is deleted.
const validBookings = user.bookings.filter(b => b.listing);

  console.log("User Bookings:", user.bookings);
  res.render("users/bookedTrips.ejs", { bookings: validBookings });
};
