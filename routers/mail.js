const express = require("express");
const { Mail } = require("../models/mail");
const router = express.Router();

router.get("/", async (req, res) => {
  const mails = await Mail.find();

  if (!mails) {
    res.status(500).json({ message: "Some error occured" });
  }

  res.send(mails);
});

router.post("/", async (req, res) => {
  let newMail = new Mail({
    email: req.body.email,
  });

  newMail = await newMail.save();

  if (!newMail) {
    res.status(500).json({ message: "Some error occured" });
  }

  res.send(newMail);
});

module.exports = router;
