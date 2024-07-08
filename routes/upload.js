const express = require("express");
const router = express.Router();
const controller = require("../controllers/upload");
const fileUpload = require("express-fileupload");

router.route("/").get(controller.getForm);
router.route("/file").post(fileUpload(), controller.upload);
module.exports = router;
