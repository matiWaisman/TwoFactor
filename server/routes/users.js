const express = require("express");
const router = express.Router();

const { postRegister, getVerify } = require("../controllers/register");

router.route("/").post(postRegister);
router.route("/:id/verify/:token/").get(getVerify);

module.exports = router;
