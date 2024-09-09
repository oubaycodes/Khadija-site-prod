/* eslint-disable no-console */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const port = +process.env.PORT;

app.listen(port, async () => {
  console.log(`Listening on port ${port}.....`);
  const DB = process.env.DB_URI.replace("<password>", process.env.DB_PASSWORD);
  mongoose.set("strictQuery", true);
  await mongoose.connect(DB);
  console.log("database connection established...");
});
