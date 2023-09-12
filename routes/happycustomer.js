const {
  happyCustomer,
  happyCustomerImages,
} = require("../models/happycustomer");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");

const router = require("express").Router();

router.post(
  "/",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res) => {
    const { details } = req.body;
    // const { brandname } = req.body;
    // const arrBrand = brandname.split(",");
    // const url = [];

    // const arrBrandImages = req.files;
    // const bradImgurl = [];
    // for (const items of arrBrandImages) {
    //   bradImgurl.push(items.filename);
    // }

    // arrBrand.map((e, i) => {
    //   url.push({
    //     name: e,
    //     isPopular: "none",
    //     img: bradImgurl[i],
    //   });
    // });
    const namearr = [];
    const ratignarr = [];
    const commetarr = [];
    details.reviews.map((i) => {
      namearr.push(i.name);
      ratignarr.push(i.rating);
      commetarr.push(i.comment);
    });

    try {
      console.log(req.files);
      const isExist = await happyCustomer.findOne({});
      if (isExist) {
        await happyCustomer.updateOne(
          { _id: req.body.happycustomerid },
          {
            $push: {
              happyCustomer: {
                username: namearr,
                comment: commetarr,
                totalRating: req.body.details.ratings,
                productName: req.body.details.title,
                productImg: req.body.details.img[0],
                rating: ratignarr,
                select: req.body.select,
              },
            },
          }
        );
      } else {
        await happyCustomer.create({
          happyCustomer: [
            {
              username: namearr,
              comment: commetarr,
              totalRating: req.body.details.ratings,
              productName: req.body.details.title,
              productImg: req.body.details.img[0],
              rating: ratignarr,
              select: req.body.select,
            },
          ],
        });
      }
      const brands = await brandModel.create({
        brand: url,
      });
      res.json({ success: true, brands });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.post(
  "/upload",
  verifyTokenAndAdmin,
  multipleUpload.array("img"),
  async (req, res) => {
    try {
      if (req.files.length > 0) {
        console.log(req.body);
        const isExist = await happyCustomerImages.findOne({});
        const customerImg = [];
        for (const items of req.files) {
          customerImg.push(items.filename);
        }

        if (isExist) {
          await happyCustomerImages.updateOne({
            $push: {
              happyCustomerImage: { $each: customerImg },
            },
          });
        } else {
          const details = await happyCustomerImages.create({
            happyCustomerImage: customerImg,
          });
          res.json({ success: true, details });
        }
      } else {
        res.json({ success: false, message: "please select a file" });
      }
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const details = await happyCustomer.findOne({});
    if (!details) {
      return res.json({ success: false, details });
    }
    return res.json({ success: true, details });
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.get("/getimages", async (req, res, next) => {
  try {
    const details = await happyCustomerImages.findOne({});
    if (!details) {
      return res.json({ success: false, details });
    }
    return res.json({ success: true, details });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/delete", async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await happyCustomer.updateOne({
      $pull: {
        happyCustomer: {
          productName: req.body.details.title,
        },
      },
    });
  } catch {}
});

router.delete("/delete/image", async (req, res, next) => {
  try {
    const data = await happyCustomerImages.updateOne({
      $pull: {
        happyCustomerImage: req.body.details,
      },
    });
  } catch {}
});

module.exports = router;
