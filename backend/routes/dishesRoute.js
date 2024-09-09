const express = require("express");
const dishController = require(`${__dirname}/../controllers/dishController.js`);
const router = express.Router();

router.route("/").get(dishController.getAllDishes);

if (process.env.NODE_ENV !== "prod") {
  router
    .route("/")
    .post(dishController.createDishes)
    .delete(dishController.deleteAllDishes);
  router.route("/upload").post(dishController.uploadFsEntries);
  router
    .route("/:id")
    .get(dishController.getDish)
    .delete(dishController.deleteDish);
}

module.exports = router;
