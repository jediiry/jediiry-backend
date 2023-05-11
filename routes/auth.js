const express = require("express"),
  router = express.Router(),
  userController = require("../controller/user");

router.post("/signup", (req, res) => {
  return userController.signUp(req, res);
});
router.post("/signin", (req, res) => {
  return userController.signIn(req, res);
});

module.exports = router;
