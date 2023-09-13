const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const razorpayRoute = require("./routes/razorpay");
const categoryRoute = require("./routes/categoryRoute");
const featureCatRoute = require("./routes/featuredCatRoute");
const getAllStatsRouter = require("./routes/allstatroute");
const serviceRouter = require("./routes/service");
const categoryRouter = require("./routes/category");
const subcategoryRouter = require("./routes/subcategory");
const brandRouter = require("./routes/brand");
const informationRouter = require("./routes/information");
const couponRouter = require("./routes/coupon");
const blogRouter = require("./routes/blog");
const phone = require("./models/phonelogin");

const happyCustomerRouter = require("./routes/happycustomer");
dotenv.config();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.authToken
);

const app = express();
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.post("/phonelogin", (req, res) => {
  client.verify.v2
    .services(process.env.serviceId)
    .verifications.create({ to: `+91${req.body.phone}`, channel: "sms" })
    .then((verification) => {
      console.log(verification);
      res.json({ success: true, verification });
    });
});
app.post("/phonelogin/verify", (req, res) => {
  client.verify.v2
    .services(process.env.serviceId)
    .verificationChecks.create({
      to: `+91${req.body.phone}`,
      code: req.body.otp,
    })
    .then(async (verification_check) => {
      console.log(verification_check);
      const isExist = await phone.findOne({
        mobile: req.body.phone,
      });
      if (isExist) {
        const accessToken = await jwt.sign(
          {
            id: isExist._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        return res.json({
          success: true,
          verification_check,
          accessToken,
          user: isExist,
        });
      } else {
        const others = await phone.create({
          mobile: req.body.phone,
        });
        console.log(others);
        const accessToken = await jwt.sign(
          {
            id: others._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        return res.json({
          success: true,
          verification_check,
          accessToken,
          user: others,
        });
      }
    })
    // await phone.create({
    //   mobile: req.body.phone,
    // })

    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRouter);
app.use("/api/category", authRoute);
app.use("/api/featured", featureCatRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/happycustomer", happyCustomerRouter);

app.use("/api/information", informationRouter);
app.use("/api/razorpay", razorpayRoute);
app.use("/api/service", serviceRouter);
app.use("/api/getallstats", getAllStatsRouter);

app.use(express.static(path.join(__dirname, "./client/build/")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(
    `listening on port ${process.env.PORT}(http://localhost:${process.env.PORT})`
  );
});

// module.exports = instance;
