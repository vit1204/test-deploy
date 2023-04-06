const express = require('express');
const app = express();
const bodyParser = require('body-parser')



const userRouter = require('./routes/user');


app.use('/users', userRouter)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.listen(3000)