const { Contact } = require("../models/contact");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const contactList = await Contact.find();
  if (!contactList) {
    res.status(500).json({ success: false });
  }
  res.send(contactList);
});

router.post("/", async (req, res) => {
  let contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  contact = await contact.save();

  if (!contact) return res.status(400).send("the contact cannot be created!");

  res.send(contact);
});

router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).send();
    }
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
