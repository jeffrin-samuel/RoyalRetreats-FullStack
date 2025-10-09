const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],

  resetOtp: {
    type: String,
    default: ""
  },

  resetOtpExpireAt: {
    type: Number,
    default: 0
  },

  bookings: [
    {
      listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
      },
      dateRange: {
        start: Date,
        end: Date
      },
      paymentInfo: {
        orderId: String,
        paymentId: String,
        status: String
      }
    }
  ]
});

// Adds username, password(salting & hashing) and authentication methods to schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
