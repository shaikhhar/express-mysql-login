const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

connection.connect();
module.exports = connection;
