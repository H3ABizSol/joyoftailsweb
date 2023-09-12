const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();
  const userCount = await User.countDocuments();
  res.status(200).json({ success: true, productCount, userCount, orderCount });
});

module.exports = router;
