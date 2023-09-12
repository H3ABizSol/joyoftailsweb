const mongoose = require("mongoose");
const informationSchema = mongoose.Schema({
  heading: { type: String, trim: true },
  desc: { type: String, trim: true },
  support: { type: String, trim: true },
  img: String,
  email: String,
  mobile: String,
});

const information = mongoose.model("information", informationSchema);
module.exports = information;
