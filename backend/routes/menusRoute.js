const express = require("express");
const menuController = require(`${__dirname}/../controllers/menuController.js`);
const router = express.Router();

router.route("/").get(menuController.getAllMenus);

if (process.env.NODE_ENV !== "prod") {
  router
    .route("/")
    .post(menuController.createMenu)
    .delete(menuController.deleteAllMenus);
  router.route("/upload").post(menuController.uploadFsEntries);
  router
    .route("/:id")
    .get(menuController.getMenu)
    .delete(menuController.deleteMenu);
}
module.exports = router;
