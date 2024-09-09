/* eslint-disable no-console */
const mongoose = require("mongoose");
const app = require("./app");

if (process.env.NODE_ENV !== "prod") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./config.env" });
}
const port = +process.env.PORT;

app.listen(port, async () => {
  console.log(`Listening on port ${port}.....`);

  const DB = process.env.DB_URI.replace("<password>", process.env.DB_PASSWORD);
  mongoose.set("strictQuery", true);
  await mongoose.connect(DB);
  console.log("database connection established...");
});
