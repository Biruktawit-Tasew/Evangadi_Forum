const express = require("express");
const router = express.Router();
const authHeader = require("../MiddleWare/authMiddleware");
const {
  allQuestions,
  postQuestion,
  singleQuestion,
  likeQuestion,
  disLikeQuestion,
} = require("../controller/questionController");
router.get("/all-questions", authHeader, allQuestions);
router.post("/post-question", authHeader, postQuestion);
router.get("/:question_id", authHeader, singleQuestion);
router.patch("/like/:question_id", authHeader, likeQuestion);
router.patch("/dislike/:question_id", authHeader, disLikeQuestion);
module.exports = router;
