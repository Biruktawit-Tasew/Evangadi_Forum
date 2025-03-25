// Database Connection
const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
// Register Controller
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await db.query(
      "SELECT username, user_id FROM registration WHERE username=? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already Registered" });
    }
    if (password.length <= 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least  8 characters" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [registrationResult] = await db.query(
      "INSERT INTO registration (username,email,password) VALUES (?,?,?) ",
      [username, email, hashedPassword]
    );
    const user_id = registrationResult.insertId;
    await db.query(
      "INSERT INTO profile (user_id,firstname,lastname) VALUES (?,?,?) ",
      [user_id, firstname, lastname]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "User Registered" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// Login Controller
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
  }
  try {
    const [user] = await db.query(
      "SELECT username, user_id, password FROM registration WHERE email=?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Credential" });
    }

    // Compare password

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Credential" });
    }
    const username = user[0].username;
    const userid = user[0].user_id;
    const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user Login Successful ", token, userid });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// Check user Controller
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(StatusCodes.OK).json({ msg: "Valid User", username, userid });
}
module.exports = { register, login, checkUser };