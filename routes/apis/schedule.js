const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api");

router.route("/anime").get(controller.getAnime);
router.route("/category").get(controller.getAnimeCategory);

module.exports = router;
