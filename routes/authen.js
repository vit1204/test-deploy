const express = require('express')
const router = express.Router();
const connections = require('../databases/connection')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mailservice = require('../service/mailservice')
const { hashPassword, comparePassword } = require("../helper/hash");
const { addAbortSignal } = require('nodemailer/lib/xoauth2');
const knex = require('knex')

const dotenv = require('dotenv')
dotenv.config()
const { validateRegisterRequest } = require('../middleware/validatemiddleware');
const { NotebookCellTextDocumentFilter } = require('vscode-languageserver');


router.post('/register', validateRegisterRequest, async (req, res,next) => {

  
  const { name, age, gender, email, username, password, confirmPassword } = req.body

  //goi database xem user da ton tai hay ch
    connections.query("SELECT * FROM users WHERE username = ?", [username], (error, result, fields) => {
    if (error) {
      return res.status(500).status({ Error: "server error" });

    }
    else if (result.length > 0) {
      return res.status(400).json({ Error: " username already exist" })
    }
    else {
        const  { hashPassword, salt } = hashPassword(password)
      const DataUser = {
        name,
        age,
        gender,
        username,
        hashPassword,
        salt,
        email
      }

      connections.query("INSERT INTO users(name,age,gender,username,hashPassword,salt,email) VALUE ?", [DataUser], (error, result, fields) => {
        if (error) {
          return res.status(500).json({error: "het cuu noi cai endpoint nay r"})
        }
        else {
          return res.status(200).json({ message: "regist successful ", data: DataUser })
        }
      })
      }


    })

})

//endpoint login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  connections.query("SELECT * FROM users WHERE username= ?", [username], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "can't find user" })

    }
    if (username.length === 0) {
      return res.status(401).json({ error: "invalid username or password" })

    }
    //nếu đúng
    let user = result[0];
    if (comparePassword(user.hashPassword, user.salt, password)) {
      const token = jwt.sign({ userToken: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      })
      return res.status(200).json({ token })
    }
    else {
      return res.status(400).json({ error: "the password is not match" })
    }
  })
})





//send mail endpoint
router.post('/sendemail', async (req, res) => {
  let { email } = req.body;
  try {
    await mailservice.mailservice.sendemail({
      from: emailForm,
      to: emailTo,
      subject: emailSubject,
      text: emailText
    });
    res.status(200).json("email : reset password");
  } catch (err) {
    res.status(500).json("Error sending email");
  }
});





module.exports = router;

