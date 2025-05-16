const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { sendPaymentSuccessEmail } = require("../utils/paymentSuccessEmail.js");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Index Callback - list all listings, with optional filtering by query, category, and price range
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  const query = req.query.query?.toLowerCase();

  if (query) {
    allListings = allListings.filter((listing) =>
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.location.toLowerCase().includes(query) ||
      listing.category.toLowerCase().includes(query)
    );
  }

  const category = req.query.category;
  if (category) {
    allListings = allListings.filter((listing) => listing.category === category);
  }

  const priceRange = req.query.price;
  let min = 0;
  let max = Infinity;

  if (priceRange && priceRange.includes('-')) {
    const [low, high] = priceRange.split('-').map(Number);
    min = low;
    max = high;
  }

  allListings = allListings.filter((listing) => listing.price >= min && listing.price <= max);

  res.render("listings/index.ejs", { allListings, hasListings: allListings.length > 0 });
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Listing Callback - show details of a single listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  const currUser = req.user;

  const isBooked = currUser && currUser.bookings
    ? currUser.bookings.some(b => b.listing.toString() === listing._id.toString())
    : false;

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, isBooked, razorpayKey: process.env.RAZORPAY_KEY_ID, req });
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Render edit form for existing listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update existing listing
module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  // Fetch the listing first to access its ID after deletion
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Delete the listing from the database
  await Listing.findByIdAndDelete(id);

  // Remove all booking entries related to the deleted listing across all users.
  // Each booking is an object in the 'bookings' array with a 'listing' field referencing a Listing document.
  // This operation pulls (removes) any booking object where 'listing' matches the deleted listing's _id.
  await User.updateMany(
    {},
    { $pull: { bookings: { listing: listing._id } } }
  );

  req.flash("success", "Listing deleted successfully.");
  res.redirect("/listings");
};



// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create booking order using Razorpay
exports.createBookingOrder = async (req, res) => {
  const { guests, amount } = req.body;
  const listingId = req.params.id;

  const options = {
    amount: amount,
    currency: 'INR',
    receipt: listingId,
    notes: {
      listingId: listingId,
      guests: guests
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Verify payment after booking
module.exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    listingId,
    guests,
  } = req.body;

  const { startDate, endDate } = req.body;

  // Calculate nights between start and end date for booking
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const nights = diffTime / (1000 * 60 * 60 * 24);

  // Verify payment signature with Razorpay secret key
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const user = await User.findById(req.user._id);
    const listing = await Listing.findById(listingId);

    if (!user || !listing) {
      return res.status(404).json({ success: false, message: "User or Listing not found" });
    }

    user.bookings.push({
      listing: listing._id,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      paymentInfo: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "Success",
      },
    });

    await user.save();

    await sendPaymentSuccessEmail(
      user.email,
      {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: listing.price * guests * nights * 100,
      },
      {
        name: listing.title,
        location: listing.location,
      },
      guests,
      startDate,
      endDate
    );

    req.flash("success", "Payment successful!");
    return res.json({ success: true, redirectUrl: "/booked-trips" });
  } else {
    return res.json({ success: false, message: "Payment verification failed" });
  }
};
