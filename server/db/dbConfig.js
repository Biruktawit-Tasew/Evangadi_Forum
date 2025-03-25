const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const db = mysql.createPool({
  host: "localhost",
  user: "evangadi-admin",
  password: process.env.DB_PASSWORD,
  database: "evangadi-practice",
});

module.exports = db.promise();
