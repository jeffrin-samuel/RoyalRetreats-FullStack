const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Handle AJAX (JSON) requests separately
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ error: "You must be logged in to book." });
        }

        // Store intended URL for redirect after login
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "Please log in to continue!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to transfer session-stored redirect URL to locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// Middleware to check if the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of the review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// Middleware to prevent listing owners from booking/wishlisting their own listings
module.exports.isNotListingOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect('/listings');
    }

    if (listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot perform this action on your own listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
