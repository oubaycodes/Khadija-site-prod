const Menu = require("../models/menusModel");
const fs = require("fs/promises");

const uploadImage = require(`${__dirname}/../modules/uploadImage`);
const deleteImage = require(`${__dirname}/../modules/deleteImage`);

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({
      status: "ok",
      data: menus,
      results: menus.length,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
const createMenu = async (req, res, next, requestBody = "") => {
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
        menuImage: imageUrl,
      };
      requestArray.push(createdObj);
    }

    await Menu.insertMany(requestArray);
    if (requestBody) return requestArray;
    res.status(201).json({
      status: "ok",
      requestArray,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.createMenu = createMenu;
exports.uploadFsEntries = async (req, res) => {
  try {
    const imagePath = `${__dirname}/../../frontend/img/menus/`;
    // const files = await fs.readdir(imagePath);
    const menusJson = await fs.readFile(
      `${__dirname}/../data/menus.json`,
      "utf-8"
    );
    const menusData = JSON.parse(menusJson);
    const menusArr = menusData.map((data) => {
      return {
        altText: data.altText,
        path: imagePath + "menu" + data.imageNumber + ".jpg",
      };
    });

    const uploadedArr = await createMenu(req, res, "", menusArr);
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
exports.getMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findById(menuId);

    res.status(200).json({
      status: "ok",
      menu,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteAllMenus = async (req, res) => {
  try {
    const deletedMenus = await Menu.find();
    for (let deletedMenu of deletedMenus) {
      await deleteImage(deletedMenu);
    }
    await Menu.deleteMany({});
    res.status(200).json({
      status: "ok",
      deletedMenus,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteMenu = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMenu = await Menu.findById(id);
    await deleteImage(deletedMenu);
    await Menu.findByIdAndDelete(deletedMenu);
    res.status(200).json({
      status: "ok",
      deletedMenu,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
