/**
 * Routes for handling review-related operations.
 * 
 * Notes:
 * - Parent route is "/listings/:id/reviews" as defined in app.js.
 * - mergeParams: true is used to access ":id" from the parent route.
 */

const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Middleware to validate review data using Joi schema
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// Create a new review for a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete a specific review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
