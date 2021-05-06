const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  const imgURI =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.image;

  let category = new Category({
    name: req.body.name,
    image: imgURI,
  });
  category = await category.save();

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});

router.put("/:id", async (req, res) => {
  let imgURI = req.body.image;
  if (imgURI.includes("dropbox") && !imgURI.includes("dl.dropboxusercontent")) {
    imgURI = req.body.image.replace("dropbox", "dl.dropboxusercontent");
  }
  let params = {
    name: req.body.name,
    image: imgURI,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

  const category = await Category.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
