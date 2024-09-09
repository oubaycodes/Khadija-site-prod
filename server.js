/* eslint-disable no-console */
const mongoose = require("mongoose");
const fs = require("fs");
const app = require("./app");
let port;
if (process.env.NODE_ENV !== "prod") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./config.env" });
  port = +process.env.PORT;
} else if (process.env.NODE_ENV === "prod") {
  fs.readdir("/etc/secrets").then((data) => {
    console.log(data);
  });
}

app.listen(port, async () => {
  console.log(`Listening on port ${port}.....`);

  const DB = process.env.DB_URI.replace("<password>", process.env.DB_PASSWORD);
  mongoose.set("strictQuery", true);
  await mongoose.connect(DB);
  console.log("database connection established...");
});
