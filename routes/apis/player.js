const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/player");


router.route("/:paramHref/:episodeNumber").get(controller.getPlayer);
router.route("/:paramHref").get(controller.getPlayer);
module.exports = router;
