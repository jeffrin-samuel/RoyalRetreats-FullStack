const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Create Review Callback
module.exports.createReview = async (req, res) => {  
    let { id } = req.params;
   
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;   // Associate the logged-in user as the review author

    await newReview.save();  // Save the new review to the database

    listing.reviews.push(newReview);  // Add this review to the listing's reviews array
    await listing.save();

    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
}

// Destroy Review Callback 
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review reference from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document from the reviews collection
    await Review.findByIdAndDelete(reviewId); 

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}
