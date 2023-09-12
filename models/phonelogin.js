const mongoose = require("mongoose");
const phoneLoginSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Please enter a unique username"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
    },
    mobile: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dxh9yv3mp/image/upload/v1685346163/download_hic4y3.png",
    },
  },
  { timestamps: true }
);

const phone = mongoose.model("phonelogin", phoneLoginSchema);
module.exports = phone;
