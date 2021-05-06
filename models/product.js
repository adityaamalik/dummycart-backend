const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  description: {
    type: String,
    default: "",
  },
  galleryImage1: String,
  color1: String,
  galleryImage2: String,
  color2: String,
  galleryImage3: String,
  color3: String,
  galleryImage4: String,
  color4: String,
  galleryImage5: String,
  color5: String,
  galleryImage6: String,
  color6: String,
  galleryImage7: String,
  color7: String,
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
  inStock: String,
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
