const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const postAnswer = async (req, res) => {
  const { answer } = req.body;
  const { question_id } = req.params;
  // Validate request body
  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  try {
    // Insert the answer into the database
    const userid = req.user.userid;
    await dbConnection.query(
      "INSERT INTO answers (user_id,question_id, answer) VALUES (?,?,?)",
      [userid, question_id, answer]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const getAnswer = async (req, res) => {
  const { question_id } = req.params;

  if (!question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Bad Request", message: "Invalid question ID" });
  }
  try {
    const [answers] = await dbConnection.query(
      "SELECT * FROM answers WHERE question_id=? ORDER BY answer_id DESC",
      [question_id]
    );
    if (answers.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be Found" });
    }

    const allAnswers = await Promise.all(
      answers.map(async (singleAnswer) => {
        const answerId = singleAnswer.answer_id;
        const content = singleAnswer.answer;
        const userId = singleAnswer.user_id;
        const createdAt = singleAnswer.created_at;
        const [singleUser] = await dbConnection.query(
          "SELECT username FROM registration WHERE user_id=?",
          [userId]
        );
        const [singleQuestion] = await dbConnection.query(
          "SELECT title,description FROM questions WHERE question_id=?",
          [question_id]
        );
        const username =
          singleUser.length > 0 ? singleUser[0].username : "Unkown User";
        console.log(username);
        const questionTitle =
          singleQuestion.length > 0
            ? singleQuestion[0].title
            : "No question Found";
        const questionDesc =
          singleQuestion.length > 0
            ? singleQuestion[0].description
            : "No question Found";
        //  console.log(username);
        return {
          answer_id: answerId,
          content: content,
          user_name: username,
          created_at: createdAt,
          title: questionTitle,
          description: questionDesc,
        };
      })
    );
    return res.status(StatusCodes.OK).json({ Answers: allAnswers });
  } catch (error) {
    console.log("Error fetching answers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { postAnswer, getAnswer };
