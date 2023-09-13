const { subCategory } = require("../models/CategoryModel");
// const multipleUpload = require("../utils/multer");
const { verifyTokenAndAdmin } = require("../utils/verify");

const router = require("express").Router();

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const { title, subcategory, animalType } = req.body;
  console.log(title);
  console.log(animalType);
  const arrCat = subcategory.split(",");
  try {
    const categoriesExist = await subCategory.findOne({
      title: title.toLowerCase(),
      animalType,
    });
    console.log(categoriesExist);
    if (
      categoriesExist?.title === title.toLowerCase() &&
      categoriesExist?.animalType === animalType.toLowerCase()
    ) {
      await subCategory.updateOne(
        { title, animalType },
        {
          $push: { subCategories: { $each: arrCat } },
        }
      );
      console.log("exist");
      return res.json({ success: true });
    } else {
      console.log("else");
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
