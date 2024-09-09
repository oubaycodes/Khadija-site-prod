const express = require("express");
const mealController = require(`${__dirname}/../controllers/mealController.js`);
const router = express.Router();

router.route("/").get(mealController.getAllMeals);

if (process.env.NODE_ENV !== "prod") {
  router
    .route("/")
    .post(mealController.createMeal)
    .delete(mealController.deleteAllMeals);
  router.route("/upload").post(mealController.uploadFsEntries);
  router
    .route("/:id")
    .get(mealController.getMeal)
    .delete(mealController.deleteMeal);
}
module.exports = router;
