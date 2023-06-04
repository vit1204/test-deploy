const express = require('express')
require('dotenv').config();
const mailservice = require('../service/mailservice')
const connections = require('../databases/connection')
const router = express.Router();
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const SECRET = process.env.JWT_SECRET
const validatePUTRequest = require("../middleware/validatemiddleware.js")
const validateDELETErequest = require('../middleware/validatemiddleware.js') 
const validateSearch = require("../middleware/validatemiddleware.js");
const { func, date } = require('joi');
const { comparePassword, hashPassword } = require('../helper/hash');
// UPDATE USER INFO
router.put('/:id', validatePUTRequest ,function (req, res) {
  // Write your code here
  const  {name,age,gender} = req.body
  user_id = req.params.id;
  const userData = {
    gender,
    name,
    age,
    email
  };
  //is valid PUT information    
  if (name.length < 2) {
    return res
      .status(400)
      .json({ error: "Name must be at least 2 characters long" });
  }
  if (typeof age !== "number" && age < 0) {
    return res.status(400).json({ error: "Age must be a positive number" });
  }
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
   if(!emailRegex.test(email)){
  return res.status(400).json({Error:"invalid email"})
    
  }
  //Verify token
  const authorizationHeader = req.headers.authorization;
   const userToken = authorizationHeader.substring(7);
  try {
      const isTokenValid = jwt.verify(userToken, SECRET);
      
      // Authorization success
      if (isTokenValid.userId == user.id) {
       
          //update user information
          connections.query('UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?', [name, age,gender, user.id],(error, results, fields) => {
          if (error) {
              return res.status(500).json({ error: " server error" });
            }
            res.status(200).json({message: " update successful"})
          }
            );
            
      }
      else

      // Authorization failed
      return res.status(401).json({
          message: 'unauthorized',
      });
  } catch (error) {
      return res.status(401).json({
          message: "un verify"
      });
    }
  });



//endpoint delete
 router.delete('/:id',validateDELETErequest,function(req,res){
  const authorizationHeader = req.headers.authorization
  const userToken = authorizationHeader.substring(7)
  try{
    const validateToken = jwt.verify(userToken,SECRET)
    if(validateToken=== user.id){
       connections.query('UPDATE users SET name = NULL ,age = NULL ,gender = NULL WHERE id = ?',[name,  age,gender,user.id], (err,result) => {
          if(err){
          throw err;
        }
        return res.status(200).json({message: 'delete succesful'})
      })
    }
    else {
    return res.status(400).json({Error: 'delete failed'})
    }
    
  }
  catch(error){
    return res.status(400).json({error:"unverify token"})

  }
})




//get user with pagination and search
router.get('/pagination',validateSearch,async (req,res) => {
const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 10
const search = req.query.search || ''

//Tinh toan offset va do dai toi da cua ds users
  const offset = (page - 1) * limit;
  const max = limit;

  // Tìm kiếm users
  const [rows, fields] = await connections.execute(
    'SELECT * FROM users WHERE name LIKE ? LIMIT ?, ?',
    [`%${search}%`, offset, max]
  );
  // Đếm số lượng users
  if([row,fields]){
  const [countRows, countFields] = await connections.execute(
    'SELECT COUNT(*) as count FROM users WHERE name LIKE ?',
    [`%${search}%`]
  );
  }
  const count = countRows[0].count;

  // Trả về kết quả
return  res.json({
    users: rows,
    count: count,
    page: page,
    limit: limit
  });

})
 

//endpoint create user lấy field createBy
router.post('/:create', async (req,res) => {
  const {name,age,gender,email,username,password} = req.body;
  const timeDate = new Date(Date.now())
   const authorizationHeader = req.headers.authorization
  const userToken = authorizationHeader.substring(7)
  try {
    const validateToken = jwt.verify(userToken,SECRET)
     if(validateToken === user.id){
    return res.status(400).json({error:'user existed'})
    }
    else{
      const passwordSalt = comparePassword(user.hashPassword,user.salt,password)
    await connections.query('UPDATE users SET name = ? , age = ?, gender =?, email = ?, username = ?, password =?, createBy = ?, creatAt = ?',[name,age,gender,email,username,password,createBy,timeDate],(err,result,fields) => {
        if(err){
          throw err
        }
       return res.status(200).json({message:'create successfully'}) 
      })
    }
  }
  

catch (err){
    return res.status(400).json({message:"error at endpoint create"})
  }
  })

  
  module.exports = router;
