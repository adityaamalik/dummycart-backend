const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    default: "",
  },
  images: [],
  totalColours: {
    type: Number,
    default: 0,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.Product = mongoose.model("Product", productSchema);

//product example
// {
//   "name": "bat",
//   "image": "url",
//   "description": "req.body.description",
//   "images": "req.body.images",
//   "originalPrice": 10,
//   "discountPercentage": 5,
//   "isFeatured":true,
//   "colours": "req.body.colours",
//   "category": "6058f35e9e4d6f4970521433"
// }
