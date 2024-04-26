const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
  password: String,
});

module.exports = mongoose.model("User", userSchema);
