const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
  title: { type: String, trim: true, lowercase: true },
  offer: { type: String, trim: true },
});

const coupon = mongoose.model("coupon", couponSchema);
module.exports = coupon;
