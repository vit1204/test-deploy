const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const joi = require('joi')
const userRouter = require('./routes/user');
const nodemailer = require('nodemailer');
const { mailservice } = require('./service/mailservice');
const authenRouter = require('./routes/authen')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json())
const dotenv = require('dotenv')
dotenv.config()


app.use('/auth', authenRouter)
app.use('/user', userRouter)
app.listen( process.env.PORT , () => {
  console.log("connected");
})
