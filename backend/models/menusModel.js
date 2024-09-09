const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
  altText: {
    type: String,
    required: [true, "Alt text is required"],
    unique: true,
  },
  menuImage: {
    type: String,
    required: [true, "menu Url is required"],
  },
});
const menuModel = mongoose.model("Menus", menuSchema);

module.exports = menuModel;
