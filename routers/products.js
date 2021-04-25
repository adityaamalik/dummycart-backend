const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const async = require("async");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "//../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const uploadOptions = multer({ storage: storage });

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

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;

  if (!file) return res.status(400).send("No image in the request");

  console.log(
    path.join(__dirname + "//../public/uploads/" + req.file.filename)
  );

  let product = new Product({
    name: req.body.name,
    image: {
      data: fs.readFileSync(
        path.join(__dirname + "//../public/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
    description: req.body.description,
    images: req.body.images,
    originalPrice: req.body.originalPrice,
    discountPercentage: req.body.discountPercentage,
    isFeatured: req.body.isFeatured,
    category: req.body.category,
  });

  product = await product.save();

  if (product) {
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

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (req.body.category) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
  }
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
      description: req.body.description,
      originalPrice: req.body.originalPrice,
      discountPercentage: req.body.discountPercentage,
      isFeatured: req.body.isFeatured,
      category: req.body.category,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];

    const product = await Product.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (product) {
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

    if (!product) return res.status(500).send("the product cannot be updated!");
    res.send(product);
  } else {
    let params = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      originalPrice: req.body.originalPrice,
      discountPercentage: req.body.discountPercentage,
      isFeatured: req.body.isFeatured,
      colours: req.body.colours,
      category: req.body.category,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const product = await Product.findByIdAndUpdate(req.params.id, params, {
      new: true,
    });

    if (product) {
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

    if (!product) return res.status(500).send("the product cannot be updated!");
    res.send(product);
  }
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

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files;
    let imgs = [];

    if (files) {
      files.map((file) => {
        imgs.push({
          data: fs.readFileSync(
            path.join(__dirname + "//../public/uploads/" + file.filename)
          ),
          contentType: "image/png",
          customId: parseInt(Math.random() * 10000000),
        });
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imgs,
      },
      { new: true }
    );

    if (product) {
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

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

router.post("/colours/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }

  const product = await Product.findById(req.params.id);

  const imgs = product.images;

  const newImages = [];
  async.eachSeries(imgs, (obj, done) => {
    if (obj.customId === req.body.imageId) {
      obj.colour = req.body.colour;
    }
    newImages.push(obj);
    done();
  });

  Product.findByIdAndUpdate(req.params.id, {
    images: newImages,
    totalColours: product.totalColours + 1,
  })
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.status(500).json({ error: e });
    });
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

module.exports = router;
