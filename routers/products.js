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

  const imgURI =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.image;

  const gimg1 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage1;

  const gimg2 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage2;

  const gimg3 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage3;

  const gimg4 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage4;

  const gimg5 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage5;

  const gimg6 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage6;

  const gimg7 =
    req.body.image.replace("dropbox", "dl.dropboxusercontent") ||
    req.body.galleryImage7;

  let product = new Product({
    name: req.body.name,
    image: imgURI,
    description: req.body.description,
    galleryImage1: gimg1,
    color1: req.body.color1,
    galleryImage2: gimg2,
    color2: req.body.color2,
    galleryImage3: gimg3,
    color3: req.body.color3,
    galleryImage4: gimg4,
    color4: req.body.color4,
    galleryImage5: gimg5,
    color5: req.body.color5,
    galleryImage6: gimg6,
    color6: req.body.color6,
    galleryImage7: gimg7,
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

  let imgURI = req.body.image;
  let gimg1 = req.body.galleryImage1;
  let gimg2 = req.body.galleryImage2;
  let gimg3 = req.body.galleryImage3;
  let gimg4 = req.body.galleryImage4;
  let gimg5 = req.body.galleryImage5;
  let gimg6 = req.body.galleryImage6;
  let gimg7 = req.body.galleryImage7;

  if (imgURI.includes("dropbox") && !imgURI.includes("dl.dropboxusercontent")) {
    imgURI = req.body.image.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg1.includes("dropbox") && !gimg1.includes("dl.dropboxusercontent")) {
    gimg1 = req.body.galleryImage1.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg2.includes("dropbox") && !gimg2.includes("dl.dropboxusercontent")) {
    gimg2 = req.body.galleryImage2.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg3.includes("dropbox") && !gimg3.includes("dl.dropboxusercontent")) {
    gimg3 = req.body.galleryImage3.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg4.includes("dropbox") && !gimg4.includes("dl.dropboxusercontent")) {
    gimg4 = req.body.galleryImage4.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg5.includes("dropbox") && !gimg5.includes("dl.dropboxusercontent")) {
    gimg5 = req.body.galleryImage5.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg6.includes("dropbox") && !gimg6.includes("dl.dropboxusercontent")) {
    gimg6 = req.body.galleryImage6.replace("dropbox", "dl.dropboxusercontent");
  }

  if (gimg7.includes("dropbox") && !gimg7.includes("dl.dropboxusercontent")) {
    gimg7 = req.body.galleryImage7.replace("dropbox", "dl.dropboxusercontent");
  }

  let params = {
    name: req.body.name,
    image: imgURI,
    description: req.body.description,
    originalPrice: req.body.originalPrice,
    galleryImage1: gimg1,
    color1: req.body.color1,
    galleryImage2: gimg2,
    color2: req.body.color2,
    galleryImage3: gimg3,
    color3: req.body.color3,
    galleryImage4: gimg4,
    color4: req.body.color4,
    galleryImage5: gimg5,
    color5: req.body.color5,
    galleryImage6: gimg6,
    color6: req.body.color6,
    galleryImage7: gimg7,
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
