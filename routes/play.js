const express = require("express");
const router = express.Router();
const controller = require("../controllers/play");
const { checkRefer } = require("../middlewares/users");

router.route("/").get(controller.play);
router.route("/api/:id").get(controller.play);

module.exports = router;
