const mongoose = require("mongoose");
const mealSchema = new mongoose.Schema({
  altText: {
    type: String,
    required: [true, "Meal title is required"],
    trim: true,
    unique: true,
  },
  descriptionText: {
    type: String,
    required: [true, "Description text is required"],
    trim: true,
  },
  mealImage: [
    {
      type: String,
      required: [true, "Meal Image is required"],
    },
  ],
  mealIngredients: [
    {
      type: String,
      required: false,
      trim: true,
    },
  ],
});
const mealModel = mongoose.model("Meals", mealSchema);

module.exports = mealModel;
