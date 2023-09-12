const path = require("path");
const blog = require("../models/blog");
const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin, verifyToken } = require("../utils/verify");
const fs = require("fs");

const router = require("express").Router();

router.post(
  "/create",
  verifyTokenAndAdmin,
  multipleUpload.single("img"),
  async (req, res) => {
    try {
      await blog.create({
        ...req.body,
        img: req.file.filename,
      });
      res.json({ success: true, message: "blog created successfully" });
    } catch (error) {
      res.json({ error });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const blogs = await blog.find({});
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blogs = await blog.findById(req.params.id);
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ error });
  }
});

router.put("/update/:id", multipleUpload.single("img"), async (req, res) => {
  try {
    console.log(req.file);
    if (req.file) {
      await blog.findByIdAndUpdate(req.params.id, {
        $set: {
          ...req.body,
          img: req.file.filename,
        },
      });
      return res.json({ success: true });
    } else {
      await blog.findByIdAndUpdate(req.params.id, {
        $set: {
          ...req.body,
        },
      });
      return res.json({ success: true });
    }
  } catch (error) {
    res.json({ error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("helo");
    const blogs = await blog.findById(req.params.id);
    console.log(blogs.img);
    fs.unlink(path.join(__dirname, `../public/uploads/${blogs.img}`), (err) => {
      if (err) {
        return res.json({ success: false, err });
      }
    });
    await blog.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "delete" });
  } catch (error) {
    res.json({ error });
  }
});

router.post("/comment/:id", verifyToken, async (req, res, next) => {
  try {
    const blogs = await blog.findById(req.params.id);
    let isCommetn = false;
    if (blogs.comments.length > 0) {
      blogs.comments.forEach(async (c, i) => {
        if (c.userId === req.body.userId) {
          isCommetn = true;
          c.name = req.body.name;
          c.comment = req.body.comment;
        }
      });
      if (isCommetn) {
        await blogs.save();
        return res.status(200).json({ success: true });
      }
    } else {
      blogs.comments.push({ ...req.body });
      await blogs.save();
      return res.status(200).json({ success: true });
    }

    if (!isCommetn) {
      console.log("yessssss");
      blogs.comments.push(req.body);
      await blogs.save();
      return res.status(200).json({ success: true });
    }

    // if (review1.reviews.length > 0) {
    //   review1.reviews.push(req.body);
    //   review1.numOfReviews++;
    //   review1.ratings = (total * 5) / (review1.numOfReviews * 5);
    //   await review1.save();
    //   return res.status(200).json({ success: true, review1 });
    //
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
