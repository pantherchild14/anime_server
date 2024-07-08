const express = require("express");
const router = express.Router();
const controller = require("../controllers/setting");
// const { auth } = require("../middlewares/users");
const { checkLogin } = require("../middlewares/users");

router.route("/").get(checkLogin, controller.getForm);
router.route("/cookie-tiktok").post(checkLogin, controller.cookie);
router.route("/cookie-kr").post(checkLogin, controller.cookieKR);
router.route("/domain").post(checkLogin, controller.cacheDomain);
router.route("/isStorages").post(checkLogin, controller.isStorages);
router.route("/isAllowDomain").post(checkLogin, controller.isAllowDomain);
router.route("/changePass").post(checkLogin, controller.changePass);
router.route("/changeDomain").post(checkLogin, controller.changeDomain);

module.exports = router;
