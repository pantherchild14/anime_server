const express = require("express");
const router = express.Router();
const { resolve } = require("path");
const controller = require("../controllers/ytb");
const { checkRefer } = require("../middlewares/users");
router.route("/:directLink").get(controller.direct);
module.exports = router;
