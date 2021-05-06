const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const async = require("async");

router.get(`/`, async (req, res) => {
  // localhost:3000/products?categories=2342342,234234

  let filter = {};
  if (req.query.category) {
    filter = { category: req.query.category };
  }

  const productList = await Product.find(filter).populate("category");

  // const productList = await Product.find({}).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get("/newArrivals", async (req, res) => {
  const newarrivalsList = await Product.find().sort({ $natural: -1 }).limit(4);

  if (!newarrivalsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(newarrivalsList);
});

router.get(`/category/:id`, async (req, res) => {
  const product = await Product.find({ category: req.params.id });

  if (!product) {
    res.status(500).json({ success: req.params.category });
  }
  res.send(product);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  let product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    galleryImage1: req.body.galleryImage1,
    color1: req.body.color1,
    galleryImage2: req.body.galleryImage2,
    color2: req.body.color2,
    galleryImage3: req.body.galleryImage3,
    color3: req.body.color3,
    galleryImage4: req.body.galleryImage4,
    color4: req.body.color4,
    galleryImage5: req.body.galleryImage5,
    color5: req.body.color5,
    galleryImage6: req.body.galleryImage6,
    color6: req.body.color6,
    galleryImage7: req.body.galleryImage7,
    color7: req.body.color7,
    originalPrice: req.body.originalPrice,
    discountPercentage: req.body.discountPercentage,
    isFeatured: req.body.isFeatured,
    category: req.body.category,
    inStock: req.body.inStock,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (req.body.category) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
  }
  let params = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    originalPrice: req.body.originalPrice,
    galleryImage1: req.body.galleryImage1,
    color1: req.body.color1,
    galleryImage2: req.body.galleryImage2,
    color2: req.body.color2,
    galleryImage3: req.body.galleryImage3,
    color3: req.body.color3,
    galleryImage4: req.body.galleryImage4,
    color4: req.body.color4,
    galleryImage5: req.body.galleryImage5,
    color5: req.body.color5,
    galleryImage6: req.body.galleryImage6,
    color6: req.body.color6,
    galleryImage7: req.body.galleryImage7,
    color7: req.body.color7,
    discountPercentage: req.body.discountPercentage,
    isFeatured: req.body.isFeatured,
    category: req.body.category,
    inStock: req.body.inStock,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

  const product = await Product.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!product) return res.status(500).send("the product cannot be updated!");
  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});
// localhost:3000/products/get/featured/3

router.get("/get/newArrivals", async (req, res) => {
  const newarrivalsList = await Product.find().sort({ $natural: -1 }).limit(2);

  if (!newarrivalsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(newarrivalsList);
});

router.post("/setDiscount", async (req, res) => {
  async.eachSeries(
    req.body.products,
    (obj, done) => {
      Product.findByIdAndUpdate(
        obj,
        {
          discountPercentage: req.body.discountPercentage,
        },
        done
      );
    },
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.send("success");
      }
    }
  );
});

router.post("/setInStock", async (req, res) => {
  async.eachSeries(
    req.body.products,
    (obj, done) => {
      Product.findByIdAndUpdate(
        obj,
        {
          inStock: req.body.inStock,
        },
        done
      );
    },
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.send("success");
      }
    }
  );
});

module.exports = router;
