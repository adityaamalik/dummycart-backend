const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../../public/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const uploadOptions = multer({ storage: storage });

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

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  let category = new Category({
    name: req.body.name,
    image: {
      data: fs.readFileSync(
        path.join(__dirname, "/../../public/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  });
  category = await category.save();

  if (!category) return res.status(400).send("the category cannot be created!");

  if (category) {
    const directory = path.join(__dirname, "/../../public/uploads/");
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }

  res.send(category);
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;

  if (file) {
    let params = {
      name: req.body.name,
      image: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const category = await Category.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (category) {
      const directory = path.join(__dirname + "//../public/uploads/");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });
    }

    if (!category)
      return res.status(400).send("the category cannot be created!");

    res.send(category);
  } else {
    let params = {
      name: req.body.name,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const category = await Category.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (!category)
      return res.status(400).send("the category cannot be created!");

    res.send(category);
  }
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
