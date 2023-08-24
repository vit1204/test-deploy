const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const authenRouter = require("./routes/authen");
const pollRouter = require("./routes/polls");

const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();

app.use("/poll",pollRouter)
app.use("/auth", authenRouter);
app.use("/user", userRouter);


app.listen(process.env.PORT, () => {
  console.log("connected");
});

