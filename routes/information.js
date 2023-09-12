const path = require("path");
const informationModel = require("../models/information");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");
const fs = require("fs");

const router = require("express").Router();

router.post(
  "/create",
  verifyTokenAndAdmin,
  multipleUpload.single("img"),
  async (req, res) => {
    try {
      const isExist = await informationModel.findOne({});

      if (!isExist) {
        console.log("helo");
        console.log(req.body);
        console.log(req.file);
        const img = req.file.filename;
        console.log(img);
        const information = await informationModel.create({
          ...req.body,
          img,
        });
        return res.json({ success: true, information });
      } else {
        if (req.body.img) {
          const information = await informationModel.updateOne(
            { email: isExist.email },
            {
              $set: { ...req.body },
            },
            { new: true }
          );
          console.log(information);
          return res.json({ success: true, information });
        } else {
          const information = await informationModel.updateOne(
            { email: isExist.email },
            {
              $set: {
                ...req.body,
                img: req.file.filename,
              },
            }
          );
          return res.json({ success: true, information });
        }
      }
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const isExist = await informationModel.findOne({});
    if (isExist) {
      const information = isExist;
      return res.json({ success: true, information });
    }
    return res.json({ success: false });
  } catch (error) {
    res.json({ error });
  }
});

router.delete("/delete", verifyTokenAndAdmin, async (req, res) => {
  console.log("helo");
  try {
    const isExist = await informationModel.findOne({});
    if (isExist) {
      const information = isExist;
      fs.unlink(
        path.join(__dirname, `../public/uploads/${information.img}`),
        (err) => {
          console.log(err);
        }
      );
      await informationModel.deleteMany({});
      return res.json({ success: true, message: "successfully" });
    }
    // return res.json({ success: true, information: null });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
