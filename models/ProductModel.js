const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Enter product title"],
      unique: true,
    },
    desc: { type: String, required: [true, "Enter product description"] },
    img: [
      {
        type: String,
        required: [true, "enter product Image"],
      },
    ],
    categories: {
      category: {
        type: String,
      },
      subCategory: {
        type: String,
      },
      animalType: {
        type: String,
      },
    },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: [true, "Enter product price"] },
    ratings: {
      type: Number,
      default: 0,
    },
    Stock: {
      type: Number,
      required: [true, "Please Enter product Stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    gramPerQuantity: [
      {
        size: String,
        price: String,
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
    animalType: {
      type: String,
      required: [true, "Please Enter product animal type"],
    },
    foodType: {
      type: String,
      default: "veg",
    },
    discount: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
