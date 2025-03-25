const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const keywords = require("../Utility/keywords");
const db = require("../db/dbConfig");
async function allQuestions(req, res) {
  try {
    const [question] = await db.query(
      "SELECT * FROM questions ORDER BY id DESC"
    );
    if (question.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No Question Found" });
    }

    // Execute multiple asynchronous operations concurrently and wait for all of them to complete before proceeding
    const allQuestions = await Promise.all(
      question.map(async (question) => {
        const questionId = question.question_id;
        const title = question.title;
        const content = question.description;
        const userId = question.user_id;
        const createdAt = question.created_at;
        const tag = question.tag;
        const likes = question.likes;
        const disLikes = question.dislike;
        const [singleUser] = await db.query(
          "SELECT username FROM registration WHERE user_id=?",
          [userId]
        );
        const username =
          singleUser.length > 0 ? singleUser[0].username : "Unkown User";
        return {
          question_id: questionId,
          title: title,
          content: content,
          user_name: username,
          created_at: createdAt,
          tag: tag,
          likes: likes,
          dislike: disLikes,
        };
      })
    );
    return res.status(StatusCodes.OK).json({ questions: allQuestions });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}
async function postQuestion(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [question] = await db.query(
      "SELECT title, description FROM questions WHERE title=? and description=?",
      [title, description]
    );
    if (question.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Same question already asked!" });
    }

    // Generate a unique questionid for each question post using uuid
    const questionid = uuidv4(); // Example: '550e8400-e29b-41d4-a716-446655440000'
    console.log(questionid);

    // Extract userid from currently logged in user info with help of jwt
    const userid = req.user.userid;

    // Extract a Tags from the title of question post
    const lowerCaseTitle = title.toLowerCase();
    const matchTag = keywords.filter((keyTag) =>
      lowerCaseTitle.includes(keyTag.toLowerCase())
    );
    const tag = matchTag.length > 0 ? matchTag : ["General"];
    const stringTag = tag.join(",");
    await db.query(
      "INSERT INTO questions (question_id,user_id,title,description,tag) VALUES (?,?,?,?,?) ",
      [questionid, userid, title, description, stringTag]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question Created Successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}

async function singleQuestion(req, res) {
  // res.status(StatusCodes.OK).json({ msg: "Single Question Displayed" });
  const { question_id } = req.params;
  try {
    const [question] = await db.query(
      "SELECT * FROM questions WHERE question_id=?",
      [question_id]
    );
    if (question.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be Found" });
    }
    const questionId = question[0].id;
    const title = question[0].title;
    const content = question[0].description;
    const userId = question[0].user_id;
    const createdAt = question[0].created_at;

    return res.status(StatusCodes.OK).json({
      question: {
        question_id: questionId,
        title: title,
        content: content,
        user_id: userId,
        created_at: createdAt,
      },
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}
async function likeQuestion(req, res) {
  const { question_id } = req.params;
  try {
    await db.query(
      "UPDATE questions SET likes = likes + 1 WHERE question_id = ?",
      [question_id]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Likes count successfully Incremented" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}

async function disLikeQuestion(req, res) {
  const { question_id } = req.params;
  try {
    await db.query(
      "UPDATE questions SET dislike = dislike + 1 WHERE question_id = ?",
      [question_id]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Likes count successfully Decremented" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}

module.exports = {
  allQuestions,
  postQuestion,
  singleQuestion,
  likeQuestion,
  disLikeQuestion,
};
