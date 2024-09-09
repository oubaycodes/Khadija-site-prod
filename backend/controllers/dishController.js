const Dish = require("../models/dishesModel");
const fs = require("fs/promises");
const uploadImage = require(`${__dirname}/../modules/uploadImage`);
const deleteImage = require(`${__dirname}/../modules/deleteImage`);

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({
      status: "ok",
      data: dishes,
      results: dishes.length,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
const createDishes = async (req, res, next, requestBody = "") => {
  try {
    // make body an array
    const reqBody = requestBody || req.body;
    let requestBodies = Array.isArray(reqBody) ? reqBody : [reqBody];

    // console.log(apiLink);
    const requestArray = [];

    for (let request of requestBodies) {
      const imageUrl = await uploadImage(request);
      const createdObj = {
        altText: request.altText,
        descriptionText: request.descriptionText,
        dishUrl: imageUrl,
      };
      requestArray.push(createdObj);
    }
    await Dish.insertMany(requestArray);
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
exports.createDishes = createDishes;
exports.uploadFsEntries = async (req, res) => {
  try {
    const imagePath = `${__dirname}/../../frontend/img/product-images/`;
    // const files = await fs.readdir(imagePath);
    const dishesJson = await fs.readFile(
      `${__dirname}/../data/dishes.json`,
      "utf-8"
    );
    const dishesData = JSON.parse(dishesJson);
    const dishesArr = dishesData.map((data) => {
      return {
        altText: data.altText,
        descriptionText: data.descriptionText,
        path: imagePath + "product" + data.imageNumber + ".jpg",
      };
    });

    const uploadedArr = await createDishes(req, res, "", dishesArr);
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
exports.getDish = async (req, res) => {
  try {
    const dishId = req.params.id;

    const dish = await Dish.findById(dishId);

    res.status(200).json({
      status: "ok",
      dish,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteAllDishes = async (req, res) => {
  try {
    const deletedDishes = await Dish.find();
    for (let deletedDish of deletedDishes) {
      await deleteImage(deletedDish);
    }
    await Dish.deleteMany({});
    res.status(200).json({
      status: "ok",
      deletedDishes,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteDish = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDish = await Dish.findById(id);
    await deleteImage(deletedDish);
    await Dish.findByIdAndDelete(deletedDish);
    res.status(200).json({
      status: "ok",
      deletedDish,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
