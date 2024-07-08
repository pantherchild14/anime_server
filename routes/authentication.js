const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentication");
const authorization = require("../middlewares/users");

router.route("/").get(controller.loginPage).post(controller.login);
router.route("/sign-up").post(controller.signUp);

module.exports = router;
