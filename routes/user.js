const express = require("express"),
  auth = require("../middlewares/index"),
  router = express.Router(),
  userController = require("../controller/user");

router.use(auth);
router.get("/transaction", (req, res) => {
  return userController.getUserTransactions(req, res);
});
router.get("/transactions", (req, res) => {
  return userController.getTransfers(req, res);
});
router.post("/transfer", (req, res) => {
  return userController.transfer(req, res);
});

module.exports = router;
