const jwt = require('jsonwebtoken')
const express = require('express')
function validatePUTRequest(req, res, next) {
  if (req.body.name && req.body.age&&req.body.gender) {
    return next();
  }

  return res.status(400).json({ message: "Error validating" });
}


const validateDELETErequest = (req,res,next) => {
  if(req.body.name && req.body.age && req.body.gender && req.body.email && req.username && req.passwrod){
    return next()
  }

  return res.status(400).json({ message: "Error validating delete request" });
}


const validateRegisterRequest = (req,res,next) => {
  if(req.body.username && req.body.password){
    return next();
  }
  else{
    res.status(400).json({"message":"Error validate" })
  }
}

const validateSearch = (req,res) => {
  const {page,limit,search} = req.query
   if(page.length<0){
    return res.status(400).json({Error:'page number must be a positive number'})
  }
if(limit<0 || limit > 15){
    return res.status(400).json({error:"page must be limit from 1 to 14"})
  }

}
module.exports = {

  validateSearch,
  validateDELETErequest,
  validatePUTRequest,
  validateRegisterRequest,
}
