const serviceModle = require("../models/serviceModle");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");
const { verifyToken } = require("../utils/verify");

const router = require("express").Router();

router.post(
  "/",
  verifyTokenAndAdmin,
  multipleUpload.single("img"),
  async (req, res) => {
    const { title, mobile, address } = req.body;
    const info = {
      title,
      mobile,
      address,
      image: req.file.filename,
    };
    console.log(info);
    try {
      const details = await serviceModle.create(info);
      console.log(details);
      res.send({ details });
    } catch (error) {}
  }
);

router.get("/", async (req, res) => {
  const details = await serviceModle.find({});
  res.status(200).json({ details });
});

router.delete("/delete/:id", async (req, res) => {
  const details = await serviceModle.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "delete successfull" });
});

router.put("/review/:id", verifyToken, async (req, res, next) => {
  try {
    console.log(req.body);
    const review1 = await serviceModle.findById(req.params.id);
    let isReview = false;
    let total = 0;
    if (review1.reviews.length > 0) {
      review1.reviews.forEach(async (rev, i) => {
        if (rev.user.toString() == req.body.user) {
          isReview = true;
          rev.rating = req.body.rating;
        }
        total += rev.rating;
      });
      if (isReview) {
        review1.ratings = total / review1.numOfReviews;
        await review1.save();
        return res.status(200).json({ success: true, review1 });
      }
    } else {
      review1.reviews.push(req.body);
      review1.numOfReviews++;
      review1.ratings = req.body.rating;
      await review1.save();
      return res.status(200).json({ success: true, review1 });
    }

    if (!isReview) {
      console.log("helo");
      review1.reviews.push(req.body);
      review1.numOfReviews++;
      console.log(total);
      review1.ratings = (total + req.body.rating) / review1.numOfReviews;
      await review1.save();
      return res.status(200).json({ success: true, review1 });
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
