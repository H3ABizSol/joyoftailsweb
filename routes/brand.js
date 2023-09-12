const brandModel = require("../models/brand");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");

const router = require("express").Router();

router.post(
  "/create",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res) => {
    const { brandname } = req.body;
    const arrBrand = brandname.split(",");
    const url = [];

    const arrBrandImages = req.files;
    const bradImgurl = [];
    for (const items of arrBrandImages) {
      bradImgurl.push(items.filename);
    }

    arrBrand.map((e, i) => {
      url.push({
        name: e,
        isPopular: "none",
        img: bradImgurl[i],
      });
    });

    try {
      const brands = await brandModel.create({
        brand: url,
      });
      res.json({ success: true, brands });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/", async (req, res) => {
  const brands = await brandModel.find({});
  res.status(200).json({ success: true, brands });
});

router.put(
  "/edit/:id",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res) => {
    if (req.files.length > 0) {
      const updatedData = {
        name: req.body.name,
        img: req.files[0].filename,
        isPopular: req.body.status,
      };
      const editBrand = await brandModel.updateOne(
        { "brand._id": req.params.id },
        {
          $set: { "brand.$": updatedData },
        }
      );
      return res.status(200).json({ success: true, editBrand });
    } else {
      const editBrand = await brandModel.updateOne(
        { "brand._id": req.params.id },
        {
          $set: {
            "brand.$": {
              name: req.body.brandname,
              img: req.body.img,
              isPopular: req.body.status,
            },
          },
        }
      );
      return res.status(200).json({ success: true, editBrand });
    }
  }
);

router.put("/changestatus/:id", verifyTokenAndAdmin, async (req, res) => {
  console.log(req.body);
  const status = await brandModel.updateOne(
    { "brand._id": req.params.id },
    {
      $set: {
        "brand.$.isPopular": req.body.status,
      },
    }
  );
  res.status(200).json({ success: true, message: "Status Change" });
});

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  const data = await brandModel.updateOne(
    { "brand._id": req.params.id },
    {
      $pull: { brand: { _id: req.params.id } },
    }
  );
  console.log(data);
  res.json({ success: true, message: "succesfully Delete" });
});

module.exports = router;
