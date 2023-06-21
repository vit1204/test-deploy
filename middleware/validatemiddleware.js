const jwt = require('jsonwebtoken')
const express = require('express')
const dotenv = require('dotenv')
const connections = require('../databases/connection')
const connection = require('express-myconnection')

dotenv.config()
function validatePUTRequest(req, res, next) {
  if (req.body.name && req.body.age && req.body.gender) {
    return next();
  }

  return res.status(400).json({ message: "Error validating" });
}


const validateDELETErequest = (req, res, next) => {
  if (req.body.name && req.body.age && req.body.gender && req.body.email && req.username && req.passwrod) {
    return next()
  }

  return res.status(400).json({ message: "Error validating delete request" });
}

const validateRegisterRequest = async (req, res, next) => {
    const { name, age, gender, username, password, confirmPassword, email } = req.body

  try {
 
    if (!name || !age || !gender || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (username.length < 3) {
      return res.status(400).json({ Error: "Username must be over 3 charester and must be not include the special charesters" });
    }
    if (password !== confirmPassword && password.length < 3) {
      return res.status(400).json({ Error: "Password don't match" })
    }
    if (typeof name !== 'string' && name.length < 3) {
      return res.status(400).json({ Error: "Name must be aleast over 3 charesters and must be a string" })
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ Error: "invalid email" })

    }
    if (typeof age !== 'number' || age < 0) {
      return res.status(400).json({ Error: "age must be a number above 0" })
    }

return  next()

  }   catch (error) {
    console.log(error)
    res.status(500).json({
      success: "false",
      message: "error validate",
      error
    })
  }

}

const validateSearch = (req, res) => {
  const { page, limit, search } = req.query
  if (page.length < 0) {
    return res.status(400).json({ Error: 'page number must be a positive number' })
  }
  if (limit < 0 || limit > 15) {
    return res.status(400).json({ error: "page must be limit from 1 to 14" })
  }

}

const validateAdmin = (req, res, next) => {
  connections.query('SELECT * FROM admin WHERE admin_id = ? ', [admin_id],)
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, SECRET);

  if (isAdmin) {
    // Nếu user là admin, gọi hàm next để tiếp tục xử lý request
    next();
  } else {
    // Nếu user không phải là admin, trả về lỗi "Unauthorized"
    res.status(401).json({ error: 'Unauthorized' });
  }
}



module.exports = {
  validateSearch,
  validateDELETErequest,
  validatePUTRequest,
  validateAdmin,
  validateRegisterRequest,
}
