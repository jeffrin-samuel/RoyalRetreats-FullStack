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

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const resourceController = require("../controllers/resource.js");

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
router.get("/dashboard", wrapAsync(resourceController.index));


module.exports = router;
