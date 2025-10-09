const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  hospitalName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ["Bed", "Oxygen", "ICU", "Medicine", "BloodUnit", "Doctor"], // add more as needed
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["Available", "Low", "Critical"],
    default: "Available"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  notes: String // optional field for extra info
});

// Optional middleware can be added if needed

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
