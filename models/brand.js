const mongoose = require("mongoose");
const brandSchema = mongoose.Schema({
  brand: [
    {
      name: String,
      img: { type: String, default: "" },
      isPopular: { type: String, default: "none" },
    },
  ],
});

const brand = mongoose.model("brand", brandSchema);
module.exports = brand;
