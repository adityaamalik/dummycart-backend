const mongoose = require("mongoose");

const mailSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

exports.Mail = mongoose.model("Mail", mailSchema);
