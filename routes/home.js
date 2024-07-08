const express = require("express");
const router = express.Router();
const { resolve } = require("path");
const controller = require("../controllers/home");
const { checkLogin } = require("../middlewares/users");
router.route("/").get(checkLogin, controller.index).delete(checkLogin, controller.delete).put(checkLogin, controller.reEncode);
router.route("/error").get(checkLogin, controller.errorProcess);
router.route("/listDelete").get(checkLogin, controller.isDeleted);
module.exports = router;
