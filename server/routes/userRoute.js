const express = require("express");
const router = express.Router();
const authHeader = require("../MiddleWare/authMiddleware");

const { register, login, checkUser} = require("../controller/userController");

// Register route
router.post("/register", register);
// Login route
router.post("/login", login);
// Check user
router.get("/check", authHeader, checkUser);

module.exports = router;