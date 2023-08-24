const express = require("express");
const router = express.Router();
const {register,login,sendemail} =  require('../controller/authController')

const { validateRegisterRequest } = require("../middleware/validatemiddleware");


router.post("/register", validateRegisterRequest,register);

//endpoint login
router.post("/login",login );

//send mail endpoint

router.post("/sendemail",sendemail);
module.exports = router;
