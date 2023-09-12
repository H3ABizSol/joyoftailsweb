const path = require("path");
const couponModel = require("../models/coupon");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");

const router = require("express").Router();

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  try {
    const isExist = await couponModel.findOne({});
    if (!isExist) {
      const coupon = await couponModel.create({
        ...req.body,
      });
      return res.json({ success: true, coupon });
    } else {
      const information = await couponModel.updateOne(
        { title: isExist.title },
        {
          $set: {
            ...req.body,
          },
        }
      );
      return res.json({ success: true, information });
    }
  } catch (error) {
    res.json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const isExist = await couponModel.findOne({});
    if (isExist) {
      const coupon = isExist;
      return res.json({ success: true, coupon });
    }
    return res.json({ success: false });
  } catch (error) {
    res.json({ error });
  }
});

router.delete("/delete", verifyTokenAndAdmin, async (req, res) => {
  try {
    const isExist = await couponModel.findOne({});
    if (isExist) {
      await couponModel.deleteMany({});
      return res.json({ success: true, message: "successfully" });
    }
    return res.json({ success: true });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
