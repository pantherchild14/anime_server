const express = require("express")
const router = express.Router()
const controller = require("../../controllers/authentication")

router.route("/sign-in").post(controller.login)
router.route("/sign-up").post(controller.signUp)

router.route("/comment").post(controller.postComment)
router.route("/comment/:comment_post_id").get(controller.getComments)

module.exports = router;
