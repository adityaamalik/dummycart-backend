const { Blog } = require("../models/blog");
const express = require("express");
const router = express.Router();

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

router.post("/", async (req, res) => {
  const imgURI =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.image;
  let blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    image: imgURI,
  });
  blog = await blog.save();

  if (!blog) return res.status(400).send("the blog cannot be created!");

  res.send(blog);
});

router.put("/:id", async (req, res) => {
  let imgURI = req.body.image;
  if (imgURI.includes("dropbox") && !imgURI.includes("dl.dropboxusercontent")) {
    imgURI = req.body.image.replace("dropbox", "dl.dropboxusercontent");
  }
  let params = {
    title: req.body.title,
    content: req.body.content,
    image: imgURI,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const blog = await Blog.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!blog) return res.status(400).send("the blog cannot be created!");

  res.send(blog);
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
