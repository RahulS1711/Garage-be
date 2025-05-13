const express = require("express");
const UserAuthController = require("../../../controller/users/auth.controller");
const router = express.Router();

router.post("/signup", UserAuthController.registerUser);
router.post("/login", UserAuthController.loginUser);

module.exports = router;
