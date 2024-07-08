const express = require("express");
const router = express.Router();
const { resolve } = require("path");
const controller = require("../../controllers/admin");
const { checkLogin } = require("../../middlewares/users");

router.route("/").get(checkLogin, controller.index).post(checkLogin, controller.crawlDetail);
router.route("/:paramHref").get(checkLogin, controller.detail);

router.route("/:paramHref/:episodeNumber").get(checkLogin, controller.player);
router.route("/delete-episode").delete(checkLogin, controller.deletedDrive);
router.route("/crawl-detail").post(checkLogin, controller.crawlDetail);
router.route("/update_detail").put(checkLogin, controller.crawlDetail);

module.exports = router;
