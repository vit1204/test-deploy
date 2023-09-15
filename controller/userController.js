const dotenv = require("dotenv");
dotenv.config();
const connections = require("../databases/connection");

const SECRET = process.env.JWT_SECRET;

const { comparePassword, hashPassword } = require("../helper/hash");

const updateUser = (req, res) => {
  const { name, age, email } = req.body;
  const user_id = req.params.id;
  const userData = {
    name,
    age,
    email,
  };
  if (typeof age !== "number" && age < 0) {
    return res.status(400).json({ error: "Age must be a positive number" });
  }

  //update user information
  connections.query(
    `UPDATE users SET name = "${userData.name}", age = "${userData.age}",  email = "${userData.email}" WHERE id = ?`,
    user_id,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: " server error" });
      }
      return res.status(200).json({
        message: " update successful",
        data: userData,
      });
    },
  );
};

const deleteUser = (req, res) => {
  const user_id = req.params.id;
  try {
    connections.query(
      `DELETE FROM users WHERE id = ${user_id}`,
      (err, results) => {
        if (err) {
          throw err;
        }
        return res.status(200).json({
          message: "delete succesful",
          data: results,
        });
      },
    );
  } catch (error) {
    return res.status(400).json({ error: "unverify token" });
  }
};

const pagination = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 5; // Default to 5 users per page if not provided
  const offset = (page - 1) * limit;

  const queryString = `SELECT * FROM users LIMIT ${offset}, ${limit}`;

  connections.query(
    queryString,
    function (error, results, fields) {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        console.log(results);
        res.status(200).json({ Pagination: results });
      }
    },
  );
};

const getUser = async (req, res) => {
  connections.query(
    `SELECT * FROM users `,
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ message: "user not exist" });
      } else {
        console.log(results);
        return res.status(200).json({ data: results });
      }
    },
  );
};

module.exports = {
  updateUser,
  getUser,
  deleteUser,
  pagination,
};
