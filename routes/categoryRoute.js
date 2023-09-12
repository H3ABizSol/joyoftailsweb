const router = require("express").Router();
const Category = require("../models/CategoryModel");
const { verifyTokenAndAdmin } = require("../utils/verify");
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
  if (!req.body.name || !req.body.banner) {
    return res.status(500).json({ message: "Please enter all fields" });
  }
  const category = await Category.create(req.body);
  return res.status(200).json(category);
});
router.get("/", async (req, res, next) => {
  const category = await Category.find();
  return res.status(200).json(category);
});
router.get("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  return res.status(200).json(category);
});
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(category);
});
module.exports = router;
