const mongoose = require("mongoose");
const happyCustomerSchema = mongoose.Schema({
  happyCustomer: [
    {
      username: Array,
      totalRating: String,
      productName: String,
      productImg: String,
      comment: { type: Array },
      rating: { type: Array },
      select: { type: String, default: false },
    },
  ],
});

const happyCustomerImageSchema = mongoose.Schema({
  happyCustomerImage: Array,
});

const happyCustomer = mongoose.model("happycustomer", happyCustomerSchema);
const happyCustomerImages = mongoose.model(
  "happycustomerImages",
  happyCustomerImageSchema
);

module.exports = { happyCustomer, happyCustomerImages };
