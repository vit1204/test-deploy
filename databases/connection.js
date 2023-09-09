const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connections = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connections.getConnection(() => {
  console.log("connected to db");
});

module.exports = connections;
