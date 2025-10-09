const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true  // Add this back since email is now separate from username
  },

  hospitalId:{
    type:String,
    required: true,
    unique: true,
  },

  resetOtp: {
    type: String,
    default: ""
  },

  resetOtpExpireAt: {
    type: Number,
    default: 0
  },
});

// Remove the config - this will use 'username' by default
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);