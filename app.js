const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const authenRouter = require("./routes/authen");
const pollRouter = require("./routes/polls");

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/poll", pollRouter);
app.use("/auth", authenRouter);
app.use("/user", userRouter);

module.exports = app;
