const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Initialize the database
const initDB = async () => {
  await Listing.deleteMany({});

  // Assign a sample owner ID to each listing
  initData.data = initData.data.map(obj => ({
    ...obj,
    owner: "67dd8d3108ca2bf853d54753"
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
