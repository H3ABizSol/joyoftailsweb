// const instance = require("../index");
// import { Razorpay } from 'razorpay';
const Razorpay = require("razorpay");
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const crypto = require("crypto");
const Payment = require("../models/PaymentModel");
const instance = new Razorpay({
  key_id: "rzp_test_7z7YDE57ZxHma4",
  key_secret: "WZ7Z07jQeeMrFif8j0zoD7IS",
});
router.post("/checkout", async (req, res) => {
  try {
    const options = {
      amount: parseInt(req.body.amount * 100),
      currency: "INR",
      // notes: {},
    };
    console.log(options);
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post("/paymentverification", async (req, res) => {
  try {
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database comes here

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // res.redirect(
      //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      // );
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/paymentveriupdate", async (req, res) => {
  try {
    await Payment.create(req.body);
    let razorpay_payment_id = req.body.razorpay_payment_id;
    // pay = { ...pay, ...req.body };
    // console.log(pay);
    // await pay.save();
    // return res.status(200).json()

    // console.log(pay);
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
    // res.writeHead(302, {
    //   Location: `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`,
    // });
    // res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
router.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);
// router.post("/payment", (req, res) => {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "INR",
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         res.status(500).json(stripeErr);
//       } else {
//         res.status(200).json(stripeRes);
//       }
//     }
//   );
// });

module.exports = router;
