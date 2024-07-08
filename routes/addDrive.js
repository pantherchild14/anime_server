const express = require("express");
const router = express.Router();
const controller = require("../controllers/addDrive");
// const { auth } = require("../middlewares/users");
const { checkLogin, checkRefer } = require("../middlewares/users");

router.route("/").post(controller.addDrive);
router.route("/api").get(controller.restAPI);

module.exports = router;
