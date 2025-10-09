const mongoose = require("mongoose");
const initData = require("./data.js"); // your sample hospital data
const Resource = require("../models/resource.js"); // updated model

async function main() {
  try {
    // Connect to Atlas
    await mongoose.connect(
      'mongodb+srv://jeffrinsamuel2006_db_user:alWE9ktDnUB31HlY@cluster0.uodvemp.mongodb.net/meditrack?retryWrites=true&w=majority'
    );
    console.log("Connected to DB");

    // Delete existing data
    await Resource.deleteMany({});

    // Insert sample data
    await Resource.insertMany(initData.data);
    console.log("Data was initialized successfully");
  } catch (err) {
    console.log("Error initializing data:", err);
  } finally {
    mongoose.connection.close(); // close connection after seeding
  }
}

main();
