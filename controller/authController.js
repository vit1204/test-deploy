const connections = require("../databases/connection");
const jwt = require("jsonwebtoken");
const mailservice = require("../service/mailservice").mailservice;
const { hashPassword, comparePassword } = require("../helper/hash");
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.JWT_SECRET;

const register = (req, res) => {
  const { name, age, gender, email, username, password } = req.body;

  try {
    connections.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (error, result) => {
        if (error) {
          return res.status(500).status({ Error: "server error" });
        } else if (result.length > 0) {
          return res.status(400).json({ Error: " username already exist" });
        } else {
          const date = new Date();
          const formatDate = date.getDate() + "/" + (date.getMonth() + 1) +
            "/" +
            date.getFullYear();

          const { hashedPassword, salt } = hashPassword(password);
          const DataUser = {
            name,
            age,
            gender,
            username,
            salt,
            hashedPassword,
            email,
            formatDate,
          };
          connections.query(
            `INSERT INTO users(name,age,gender,username,password,salt,email,CreatedAt) VALUES ('${DataUser.name}', '${DataUser.age}', '${DataUser.gender}', '${DataUser.username}', '${DataUser.hashedPassword}', '${DataUser.salt}', '${DataUser.email}', '${DataUser.formatDate}' )`,
            (error, result) => {
              if (error) {
                console.log(error);
                return res.status(500).json({
                  error: "het cuu noi ",
                });
              }
              return res.status(200).json({
                message: "regist successful ",
                data: DataUser,
              });
            },
          );
        }
      },
    );
  } catch (error) {
    throw error;
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  connections.query(
    `SELECT * FROM users WHERE username = '${username}'`,
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "can't find user" });
      }
      if (result.length === 0) {
        return res.status(401).json({ error: "invalid username or password" });
      }
      //nếu đúng

      let user = result[0];

      if (comparePassword(user.password, user.salt, password)) {
        const token = jwt.sign(
          { userToken: user.id },
          SECRET,
          { expiresIn: "1d" },
        );
        return res.status(200).json({ message: "login successful", token });
      } else {
        return res.status(400).json({ error: "somthing wrong when login" });
      }
    },
  );
};

const sendemail = async (req, res) => {
  let { email } = req.body;
  try {
    await mailservice.sendemail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
    res.status(200).json("email : reset password");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error sending email");
  }
};
module.exports = {
  register,
  login,
  sendemail,
};
