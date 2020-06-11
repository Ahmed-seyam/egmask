const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a product name "]
    },
    description: {
      type: String,
      required: [true, "please provide a description for the product"]
    },
    photo: {
      type: String,
      required: [true, "Please provide a photo for the product"]
    },
    company: {
      type: String
    },
    price: {
      type: Number,
      required: [true, "product must have a price"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual populate
productSchema.virtual("promoters", {
  ref: "Promoter",
  foreignField: "product",
  localField: "_id"
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
