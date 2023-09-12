const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    order_id: { type: String },
    name: { type: String },
    products: [
      {
        productId: {
          type: String,
          // required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        img: Array,
        name: String,
        price: Number,
      },
    ],
    phoneNo: { type: Number },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
    paymentmethod: { type: String, default: "prepaid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
