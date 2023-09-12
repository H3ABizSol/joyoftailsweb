const Featured = require("../models/FeaturedModel");
const mongoose = require("mongoose");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");
const fs = require("fs");
const path = require("path");

const router = require("express").Router();
// GET FEATURE IMAGES
router.get("/", async (req, res, next) => {
  try {
    const feature = await Featured.findOne({});
    return res.status(200).json(feature);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// CREATE FEATURE IMAGES
router.post(
  "/",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res, next) => {
    let url = [];
    const files = req.files;
    for (file of files) {
      url.push(file.filename);
    }
    try {
      const match = await Featured.findOne({ isAdmin: req.body.isAdmin });
      if (match) {
        const feature = await Featured.updateOne(
          {
            isAdmin: req.body.isAdmin,
          },
          { $set: { img: url } },
          {
            new: true,
          }
        );
        // await feature.save();
        return res.status(200).json({ success: true, feature });
      } else {
        await Featured.create({
          img: url,
          isAdmin: req.body.isAdmin,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
  }
);

router.put(
  "/addmore",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res, next) => {
    try {
      console.log(req.files);
      const match = await Featured.findOne({});
      console.log(match);
      if (match) {
        const feature = await Featured.updateOne(
          {
            _id: req.body.featuredId,
          },
          { $push: { img: req.files[0].filename } },
          {
            new: true,
          }
        );
        return res.status(200).json({ success: true, feature });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "please create first" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
  }
);

// UPDATE FEATURE IMAGES
router.put(
  "/:name",
  verifyTokenAndAdmin,
  multipleUpload.single("img"),
  async (req, res, next) => {
    try {
      const featureData = await Featured.findOne();
      for (item of featureData.img) {
        if (item === req.params.name) {
          fs.unlink(
            path.join(__dirname, `../public/uploads/${item}`),
            (err) => {
              console.log(err);
            }
          );
          await Featured.findByIdAndUpdate(req.body.featuredId, {
            $pull: { img: item },
          });
          await Featured.findByIdAndUpdate(req.body.featuredId, {
            $push: {
              img: {
                $each: [req.file.filename],
                $position: req.body.index,
              },
            },
          });
        }
      }
      res
        .status(200)
        .json({ success: true, message: "Feature added Successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
// DELETE FEATURE IMAGES
router.put("/delete/:name", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const featureData = await Featured.findOne();

    for (item of featureData.img) {
      if (item === req.params.name) {
        fs.unlink(path.join(__dirname, `../public/uploads/${item}`), (err) => {
          console.log(err);
        });
        await Featured.findByIdAndUpdate(req.body.featureId, {
          $pull: { img: item },
        });
      }
    }
    res
      .status(200)
      .json({ success: true, message: "Feature deleted Successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
