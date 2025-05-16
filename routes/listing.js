/**
 * This file handles all listing-related routes.
 * 
 * Notes:
 * - All routes here are prefixed with "/listings" due to app.use("/listings", listings) in app.js.
 * - Moved from app.js for better modularity and structure.
 */

const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

const listingController = require("../controllers/listing.js");

const { isLoggedIn, isOwner, isNotListingOwner } = require("../middleware.js");

// Server-side validation middleware using Joi
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// INDEX - All listings
router.get("/", wrapAsync(listingController.index));

// NEW - Render form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW - Show details of a listing
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE - Create new listing
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

// EDIT - Render form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE - Update listing
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// DELETE - Delete listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// BOOK - Book a listing
router.post("/:id/book", isLoggedIn, isNotListingOwner, wrapAsync(listingController.createBookingOrder));

// VERIFY PAYMENT
router.post("/verify-payment", wrapAsync(listingController.verifyPayment));

module.exports = router;
