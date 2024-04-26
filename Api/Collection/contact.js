const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false // Make the email field optional
  },
  isSpam: {
    type: Boolean,
    default: false // Assuming it should default to false
  }
});

module.exports = mongoose.model("Contact", contactSchema);
