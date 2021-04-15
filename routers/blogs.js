const { Blog } = require("../models/blog");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  const blogList = await Blog.find();
  if (!blogList) {
    res.status(500).json({ success: false });
  }
  res.send(blogList);
});

router.get(`/:id`, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(500).json({ success: false });
  }
  res.send(blog);
});

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (file) {
    let blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    });
    blog = await blog.save();

    if (blog) {
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

    if (!blog) return res.status(400).send("the blog cannot be created!");

    res.send(blog);
  } else {
    let blog = new Blog({
      title: req.body.title,
      content: req.body.content,
    });
    blog = await blog.save();

    if (!blog) return res.status(400).send("the blog cannot be created!");

    res.send(blog);
  }
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  if (file) {
    let params = {
      title: req.body.title,
      content: req.body.content,
      image: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const blog = await Blog.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (blog) {
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

    if (!blog) return res.status(400).send("the blog cannot be created!");

    res.send(blog);
  } else {
    let params = {
      title: req.body.title,
      content: req.body.content,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];

    const blog = await Blog.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (!blog) return res.status(400).send("the blog cannot be created!");

    res.send(blog);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).send();
    }
    res.send("Blog succesfully deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
