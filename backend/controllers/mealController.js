const Meal = require("../models/mealsModel");
const fs = require("fs/promises");

const uploadImage = require(`${__dirname}/../modules/uploadImage`);
const deleteImage = require(`${__dirname}/../modules/deleteImage`);

exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json({
      status: "ok",
      data: meals,
      results: meals.length,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
const createMeal = async (req, res, next, requestBody = "") => {
  try {
    // make body an array
    const reqBody = requestBody || req.body;
    let requestBodies = Array.isArray(reqBody) ? reqBody : [reqBody];

    // console.log(apiLink);
    const requestArray = [];

    for (let request of requestBodies) {
      // request is array
      const imageUrl = await uploadImage(request);

      const createdObj = {
        altText: request.altText,
        descriptionText: request.descriptionText,
        mealImage: imageUrl, //as array
        mealIngredients: request.mealIngredients, // also an array
      };
      requestArray.push(createdObj);
    }
    await Meal.insertMany(requestArray);
    if (requestBody) return requestArray;
    res.status(201).json({
      status: "ok",
      requestArray,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.createMeal = createMeal;
exports.uploadFsEntries = async (req, res) => {
  try {
    const imagePath = `${__dirname}/../../frontend/img/meals/`;
    // const files = await fs.readdir(imagePath);
    const mealsJson = await fs.readFile(
      `${__dirname}/../data/meals.json`,
      "utf-8"
    );
    const mealsData = JSON.parse(mealsJson);

    const MealsArr = mealsData.map((data) => {
      return {
        altText: data.altText,
        descriptionText: data.descriptionText,
        path: data.mealImage.map(
          (image) => imagePath + "meal" + image + ".jpg"
        ),
        mealIngredients: data.mealIngredients,
      };
    });

    const uploadedArr = await createMeal(req, res, "", MealsArr);
    res.status(201).json({
      status: "ok",
      uploadedArr,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getMeal = async (req, res) => {
  try {
    const mealId = req.params.id;

    const meal = await Meal.findById(mealId);

    res.status(200).json({
      status: "ok",
      meal,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteAllMeals = async (req, res) => {
  try {
    const deletedMeals = await Meal.find();
    for (let deletedMeal of deletedMeals) {
      await deleteImage(deletedMeal);
    }
    await Meal.deleteMany({});
    res.status(200).json({
      status: "ok",
      deletedMeals,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteMeal = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMeal = await Meal.findById(id);
    await deleteImage(deletedMeal);
    await Meal.findByIdAndDelete(id);
    res.status(200).json({
      status: "ok",
      deletedMeal,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
