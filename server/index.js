const express = require("express");
const app = express();
const cors = require("cors");
const port = 2017;
const { StatusCodes } = require("http-status-codes");

// Database Connection
const db = require("./db/dbConfig");
app.use(cors());

// json middleware to extract json data
app.use(express.json());

//Importing userRoutes
const userRoutes = require("./routes/userRoute");
// Importing answerRoute
const answerRoute = require("./routes/answerRoute");

//Importing questionRoutes
const questionRoute = require("./routes/questionRoute");
// user route middleware
app.use("/api/users", userRoutes);
// Question route middleware 
app.use("/api/question", questionRoute);
// Answers Route middleware
app.use("/api/answers", answerRoute);
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "It is working" });
});


async function start() {
  try {
    await app.listen(port);
    console.log("Database Connected Successfully");
    console.log(`Server is Listenning on http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();