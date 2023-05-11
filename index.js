// load Envs
require("dotenv").config();
// imports
const express = require("express"),
  user = require("./routes/user"),
  auth = require("./routes/auth"),
  bodyParser = require("body-parser");

const instance = express(),
  port = process.env.PORT;

instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: true }));

instance.use("/user", user);
instance.use("/auth", auth);

instance.use((req, res) => {
  const error = new Error("Router not found");
  error.status = 404;
  res.json(error);
});
instance.listen(port, (err) => {
  err ? console.log(err) : console.log(`server is running on port ${port}`);
});
