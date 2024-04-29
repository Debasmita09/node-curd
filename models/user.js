const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    requied: true,
  },
  created: {
    type: Date,
    requied: true,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", userSchema);
