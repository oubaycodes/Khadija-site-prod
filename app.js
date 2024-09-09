const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// middleware
app.use(express.json());
app.use(bodyParser.json());
// import routes
const dishesRoute = require(`${__dirname}/backend/routes/dishesRoute.js`);
const mealRoute = require(`${__dirname}/backend/routes/mealsRoute.js`);
const menuRoute = require(`${__dirname}/backend/routes/menusRoute.js`);
// use routes
app.use("/", express.static(`${__dirname}/frontend`));
app.use("/dishes", dishesRoute);
app.use("/meals", mealRoute);
app.use("/menus", menuRoute);
// listening

module.exports = app;
