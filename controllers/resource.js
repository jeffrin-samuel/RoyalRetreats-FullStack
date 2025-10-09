const Resource = require("../models/resource.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  try {
    // Fetch all resources
    const allResources = await Resource.find({});

    // Prepare summary data
    const summary = {
      totalHospitals: new Set(allResources.map(r => r.hospitalName)).size,
      totalBeds: allResources
        .filter(r => r.resourceType === "Bed")
        .reduce((sum, r) => sum + r.quantityAvailable, 0),
      totalOxygen: allResources
        .filter(r => r.resourceType === "Oxygen")
        .reduce((sum, r) => sum + r.quantityAvailable, 0),
      totalBlood: allResources
        .filter(r => r.resourceType === "BloodUnit")
        .reduce((sum, r) => sum + r.quantityAvailable, 0),
      totalMedicines: allResources
        .filter(r => r.resourceType === "Medicine")
        .reduce((sum, r) => sum + r.quantityAvailable, 0),
      totalPatients: 0 // You can add patients logic separately if needed
    };

    // Prepare arrays for table rendering
    const hospitals = [];
    const hospitalMap = {};

    allResources.forEach(r => {
      if (!hospitalMap[r.hospitalName]) {
        hospitalMap[r.hospitalName] = {
          name: r.hospitalName,
          location: r.location,
          bedsAvailable: 0,
          oxygenUnits: 0,
          bloodUnits: 0,
          medicines: 0
        };
        hospitals.push(hospitalMap[r.hospitalName]);
      }

      switch (r.resourceType) {
        case "Bed":
          hospitalMap[r.hospitalName].bedsAvailable += r.quantityAvailable;
          break;
        case "Oxygen":
          hospitalMap[r.hospitalName].oxygenUnits += r.quantityAvailable;
          break;
        case "BloodUnit":
          hospitalMap[r.hospitalName].bloodUnits += r.quantityAvailable;
          break;
        case "Medicine":
          hospitalMap[r.hospitalName].medicines += r.quantityAvailable;
          break;
      }
    });

    // Alerts: resources with Low or Critical status
    const alerts = allResources
      .filter(r => r.status === "Low" || r.status === "Critical")
      .map(r => ({
        message: `${r.resourceType} low in ${r.hospitalName}`,
        level: r.status === "Critical" ? "alert-high" : "alert-medium"
      }));

    // Render template
    res.render("resources/index.ejs", { summary, hospitals, patients: [], supplies: [], alerts });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while fetching resources");
  }
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
