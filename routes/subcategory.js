const { subCategory } = require("../models/CategoryModel");
// const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");

const router = require("express").Router();

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const { title, subcategory, animalType } = req.body;
  console.log(title);
  const arrCat = subcategory.split(",");
  try {
    const categoriesExist = await subCategory.findOne({
      title: title.toLowerCase(),
      animalType,
    });

    if (
      categoriesExist?.title === title &&
      categoriesExist?.animalType === animalType
    ) {
      await categoriesExist.updateOne({
        $push: { subCategories: { $each: arrCat } },
      });
      return res.json("success");
    } else {
      const subcategories = await subCategory.create({
        title,
        subCategories: arrCat,
        animalType,
      });
      res.json({ success: true, subcategories });
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.get("/", async (req, res) => {
  const subcategories = await subCategory.find({});
  res.status(200).json({ success: true, subcategories });
});

router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  const isExist = await subCategory.findById(req.params.id);
  await subCategory.updateOne(
    { _id: req.params.id },
    {
      $pull: { subCategories: req.body.name },
    }
  );

  // res.status(200).json({ success: true, message: "Delete Successfully" });
});

module.exports = router;
