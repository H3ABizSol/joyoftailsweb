const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  title: [
    {
      name: String,
      img: String,
      isPopular: { type: String, default: "none" },
    },
  ],
});

const subCategorySchema = mongoose.Schema({
  title: { type: String, lowercase: true },
  subCategories: [],
  animalType: String,
});
const subCategory = mongoose.model("subCategory", subCategorySchema);

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = { subCategory, categoryModel };
