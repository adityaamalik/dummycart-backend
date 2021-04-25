const { Review } = require("../models/review");
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
  const reviewList = await Review.find();

  if (!reviewList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(reviewList);
});

router.get("/:id", async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res
      .status(500)
      .json({ message: "The review with the given ID was not found." });
  }
  res.status(200).send(review);
});

var cpUpload = uploadOptions.fields([
  { name: "userimage", maxCount: 1 },
  { name: "commentimages", maxCount: 1 },
]);

router.post("/", cpUpload, async (req, res) => {
  if (
    req.files["userimage"] !== undefined &&
    req.files["commentimages"] !== undefined
  ) {
    var userf = req.files["userimage"][0].filename;
    var commentf = req.files["commentimages"][0].filename;

    let review = new Review({
      name: req.body.name,
      userimage: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + userf)
        ),
        contentType: "image/png",
      },
      comment: req.body.comment,
      commentimages: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + commentf)
        ),
        contentType: "image/png",
      },
      rating: req.body.rating,
      email: req.body.email,
    });
    review = await review.save();

    if (review) {
      const directory = path.join(__dirname + "//../public/uploads/");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== "demo.txt") {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
            });
          }
        }
      });
    }

    if (!review) return res.status(400).send("the review cannot be created!");

    res.send(review);
  } else if (req.files["commentimages"] !== undefined) {
    var commentf = req.files["commentimages"][0].filename;

    let review = new Review({
      name: req.body.name,

      comment: req.body.comment,
      commentimages: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + commentf)
        ),
        contentType: "image/png",
      },
      rating: req.body.rating,
      email: req.body.email,
    });

    review = await review.save();

    if (review) {
      const directory = path.join(__dirname + "//../public/uploads/");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== "demo.txt") {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
            });
          }
        }
      });
    }

    if (!review) return res.status(400).send("the review cannot be created!");

    res.send(review);
  } else if (req.files["userimage"] !== undefined) {
    var userf = req.files["userimage"][0].filename;

    let review = new Review({
      name: req.body.name,
      userimage: {
        data: fs.readFileSync(
          path.join(__dirname + "//../public/uploads/" + userf)
        ),
        contentType: "image/png",
      },
      comment: req.body.comment,

      rating: req.body.rating,
      email: req.body.email,
    });
    review = await review.save();

    if (review) {
      const directory = path.join(__dirname + "//../public/uploads/");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== "demo.txt") {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
            });
          }
        }
      });
    }

    if (!review) return res.status(400).send("the review cannot be created!");

    res.send(review);
  } else {
    let review = new Review({
      name: req.body.name,
      comment: req.body.comment,
      rating: req.body.rating,
      email: req.body.email,
    });
    review = await review.save();

    if (review) {
      const directory = path.join(__dirname + "//../public/uploads/");
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file !== "demo.txt") {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
            });
          }
        }
      });
    }

    if (!review) return res.status(400).send("the review cannot be created!");

    res.send(review);
  }
});

router.delete("/:id", (req, res) => {
  Review.findByIdAndRemove(req.params.id)
    .then((review) => {
      if (review) {
        return res
          .status(200)
          .json({ success: true, message: "the review is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "review not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
