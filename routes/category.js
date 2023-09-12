const path = require("path");
const { categoryModel } = require("../models/CategoryModel");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");
const fs = require("fs");

const router = require("express").Router();

router.post(
  "/create",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res) => {
    const { title } = req.body;
    const arrCat = title.split(",");
    const catImages = req.files;
    const catImagesUrl = [];
    for (const items of catImages) {
      catImagesUrl.push(items.filename);
    }
    const url = [];
    arrCat.map((e, i) => {
      url.push({
        name: e,
        img: catImagesUrl[i],
        isPopular: "none",
      });
    });

    try {
      const categories = await categoryModel.create({
        title: url,
      });
      res.json({ success: true, categories });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/", async (req, res) => {
  const categories = await categoryModel.find({});
  res.status(200).json({ success: true, categories });
});

router.put("/changestatus/:id", verifyTokenAndAdmin, async (req, res) => {
  const categories = await categoryModel.updateOne(
    { "title.name": req.body.name },
    {
      $set: { "title.$.isPopular": req.body.status },
    }
  );
  res.status(200).json({ success: true, categories });
});

router.put(
  "/edit/:id",
  verifyTokenAndAdmin,
  multipleUpload.single("img"),
  async (req, res) => {
    if (req.file) {
      const edit = await categoryModel.updateMany(
        { "title._id": req.params.id },
        {
          $set: {
            "title.$": {
              name: req.body.title,
              img: req.file.filename,
              isPopular: req.body.popular,
            },
          },
        }
      );

      res.status(200).json({ success: true, edit });
    } else {
      const edit = await categoryModel.updateMany(
        { "title._id": req.params.id },
        {
          $set: {
            "title.$": {
              name: req.body.title,
              img: req.body.img,
              isPopular: req.body.popular,
            },
          },
        }
      );
      res.status(200).json({ success: true, edit });
    }
  }
);

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  const isExist = await categoryModel.findOne({ "title._id": req.params.id });
  fs.unlink(
    path.join(__dirname, `../public/uploads/${req.body.img}`),
    (err) => {}
  );
  await categoryModel.updateOne(
    { "title._id": req.params.id },
    {
      $pull: { title: { _id: req.params.id } },
    }
  );
  const checkIsEmpty = await categoryModel.findOne({ _id: isExist._id });
  if (checkIsEmpty.title.length === 0) {
    await categoryModel.deleteOne({ _id: isExist._id });
  }
  res.status(200).json({ success: true, message: "Delete Successfully" });
});

module.exports = router;
