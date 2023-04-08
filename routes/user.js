 const { json } = require('body-parser');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const userIn4 = [
	{
		"id" :  1,
		"fullname": "Nguyen Huy Tuong",
		"gender": true,
		"age": 18
	},
	{
		"id": 2,
		"fullname": "Nguyen Thi Tuong",
		"gender": false,
		"age": 15
	}
]

router.get('/', (req, res) => {
    res.json(userIn4)
})

router.get('/:id',(req, res) =>{

    res.json(req.params.id)
})

router.put('/:id', (req, res) =>{
   const userId = req.params.id; 
  const updatedData = req.body; 

  
  for (let i = 0; i < userIn4.length; i++) {
    if (userIn4[i].id == userId) {
      userIn4[i].fullname = updatedData.fullname;
      userIn4[i].gender = updatedData.gender;
      userIn4[i].age = updatedData.age;
    
    }
  } 
  res.sendStatus(204);

})

router.delete('/:id', (req,res) => {
  

  userIn4.splice(req.params.id, 1);
  for (let i = 0; i<= userIn4.length; i++) {
       userIn4[i].id =i;
}
 return res.status(204).end();
})

const validate = (user) => {
    const shecma = Joi.object({  
        fullname: Joi.string().alphanum().min(3).max(30).required(),
    age: Joi.number().integer().min(1).max(300).required(),
    gender: Joi.string().max(3)})
  
shecma.validate(user)
}

router.post('/', validate, (req,res,next) => {

    const user = req.body;
    req.body.id = userIn4.body.id +1;
    userIn4.push(req.body)
    res.status(201).json(userIn4)
})









module.exports = router
 