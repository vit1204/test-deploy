const express = require('express')
const router = express.Router();
const connections = require('../databases/connection')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mailservice = require('../service/mailservice')
const { hashPassword, comparePassword } = require("../helper/hash");
const { addAbortSignal } = require('nodemailer/lib/xoauth2');
const { valid, required, link, invalid } = require('joi');
const knex = require('knex')
const validatePUTRquest = require('./user.js')
const dotenv = require('dotenv')
dotenv.config()
const validateRegisterRequest = (req,res,next) => {
  if(req.body.username && req.body.password){
    return next();

  }
  else{
    res.status(400).json({"message":"Error validate" })
  }
}

//register endpoint

router.post('/register', validateRegisterRequest, async (req,res) => {
const {username,password,email,name,gender,age,confirmedPassword} = req.body;

const usernameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
  if (usernameRegex.test(username) && username.length < 3){
    return res.status(400).json({Error: "Username must be over 3 charester and must be not include the special charesters"});
    }
  if(password.length < 3){
    return res.status(400).json({Error: "Password must be aleast 3 charester long"})
  } 
  if(password !== confirmedPassword){
  return res.status(400).json({Erior: "invalid password"})
  }
  if(typeof name !== 'string' && name.length < 3 ) {
    return res.status(400).json({Error: "Name must be aleast over 3 charesters"})
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
   if(!emailRegex.test(email)){
  return res.status(400).json({Error:"invalid email"})
    
  }
  if(typeof age !== 'number' || age <0){
    return res.status(400).json({Error: "age must be a number above 0"})
  }
  //goi database xem user da ton tai hay ch
  connections.query("SELECT * FROM users WHERE username = ?", [username],(error,result,fields) =>{
     if(error){
      return res.status(500).status({Error: "server error"});
      
    }
    else if(result.value === username || result.length > 0){
        return res.status(400).json({Error: " username already exist"})
    }
    else{
      const {hashPassword,salt } = hashPassword(password)
      const DataUser = {
        name,
        age,
        gender,
        username,
        hashPassword,
        salt,
        email
      }
    } 
    connections.query("INSERT INTO users SET ?",[DataUser],(error,result,fields) =>{
      if(error){
        throw error;
      }
      else{
        return res.status(200).json({message:"regist successful "})
      }
    }) 
  })
})

//login endpoint

router.post('/login', (req,res) => {
const {username,password}= req.body
  connections.query("SELECT * FROM users WHERE username= ?",[username],(error,result) => {
   if(error){
      return res.status(500).json({error:"can't find user"})

    }
    if(username.length === 0 ){
      return res.status(401).json({error:"invalid username or password"})

    }
  //nếu đúng
    let user = result[0];
   if(comparePassword(user.hashPassword,user.salt,password)){
      const token = jwt.sign({userToken:user.id},process.env.JWT_SECRET,{
        expiresIn:"1d"
      } )
   return res.status(200).json({token})
    }
   else{
      return res.status(400).json({error: "the password is not match"})
    }
})
})



//send mail endpoint
router.post('/sendemail', async (req,res) => {
  let {email} = req.body;
  try {
    await mailservice.mailservice.sendemail({
      from: emailForm,
      to:emailTo,
      subject:emailSubject,
      text:emailText
    });
    res.status(200).json("email : reset password");
  } catch (err) {
    res.status(500).json("Error sending email");
  }
});

//thêm user mới




module.exports = router;

