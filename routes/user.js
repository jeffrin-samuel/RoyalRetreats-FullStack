const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport"); 
const { saveRedirectUrl } = require("../middleware.js");
const { isLoggedIn, isNotListingOwner } = require("../middleware.js");

const userController = require("../controllers/user.js");

const { resetPasswordSchema, signUpSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


// Middleware to validate Sign Up form using Joi
const validateSignUpForm = (req, res, next) => {
    let { error } = signUpSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message); 
        return res.redirect("/signup");
    } else {
        next();
    }
};

// Middleware to validate Reset Password form using Joi
const validateResetPassForm = (req, res, next) => {
    let { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/login/reset/new");
    } else {
        next();
    }
};


// Wishlist Routes
router.get("/wishlists", isLoggedIn, wrapAsync(userController.renderWishlists));

router.post("/listings/:id/wishlists", isLoggedIn, isNotListingOwner, wrapAsync(userController.Wishlists));


// User Authentication Routes

// Sign Up
router.get("/signup", userController.renderSignupForm);
router.post("/signup", validateSignUpForm, wrapAsync(userController.signup));

// Login
router.get("/login", userController.renderLoginForm);

router.post(
    "/login",  
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// Logout
router.get("/logout", userController.logout);


// Profile Routes
router.get("/profile", isLoggedIn, userController.profile);

router.get("/profile/edit", isLoggedIn, userController.renderEditForm);
router.put("/profile", isLoggedIn, wrapAsync(userController.updateProfile));


// Password Reset Flow

// 1. Request OTP Form
router.get("/login/reset", userController.renderOtpForm);

// 2. Send OTP to User's Email
router.post("/login/reset", wrapAsync(userController.sendResetOtp));

// 3. Render OTP Verification Form
router.get("/login/reset/verify", userController.renderOTPVerify);

// 4. Verify OTP and Allow Password Reset
router.post("/login/reset/verify", wrapAsync(userController.OTPVerify));

// 5. Render New Password Form
router.get("/login/reset/new", userController.renderNewPassForm);

// 6. Set New Password Route
router.post("/login/reset/new", validateResetPassForm, wrapAsync(userController.resetPassword));


// Booked Trips Routes
router.get("/booked-trips", isLoggedIn, userController.renderTrips);

router.post("/listings/:id/book", isLoggedIn, wrapAsync(userController.addTrip));


module.exports = router;
