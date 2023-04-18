const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const joi = require('joi')
const userRouter = require('./routes/user');


app.use('/users', userRouter)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());
app.listen(3000)
