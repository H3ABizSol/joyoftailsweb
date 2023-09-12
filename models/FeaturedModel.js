const mongoose = require("mongoose");
const featuredSchema = new mongoose.Schema({
  isAdmin: { type: String },
  img: Array,
});
const Featured = mongoose.model("Featured", featuredSchema);
module.exports = Featured;
