const mongoose = require("mongoose");
const dishSchema = new mongoose.Schema({
  altText: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  descriptionText: {
    type: String,
    required: [true, "Description text is required"],
    trim: true,
  },
  dishUrl: {
    type: String,
    unique: true,
    required: [true, "Dish Url is required"],
    trim: true,
  },
});
const dishModel = mongoose.model("Dishes", dishSchema);

module.exports = dishModel;
