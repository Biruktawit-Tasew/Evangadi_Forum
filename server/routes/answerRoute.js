const express = require("express");
const router = express.Router();
const authHeader = require("../MiddleWare/authMiddleware");
const { postAnswer, getAnswer } = require("../controller/answerController");

router.post("/post-answers/:question_id", authHeader, postAnswer);
router.get("/:question_id", authHeader, getAnswer);
module.exports = router;
