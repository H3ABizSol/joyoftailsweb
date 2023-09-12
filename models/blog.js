const mongoose = require("mongoose");
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
    comments: [
      {
        userId: String,
        name: String,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

const blog = mongoose.model("blog", blogSchema);
module.exports = blog;
