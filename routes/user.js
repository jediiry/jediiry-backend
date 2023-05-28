const express = require("express"),
  router = express.Router(),
  userController = require("../controller/user");

router.post("/", (req, res) => {
  return userController.sendMail(req, res);
});

module.exports = router;
