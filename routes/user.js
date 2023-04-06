 const express = require('express');
const router = express.Router();

const userIn4 = [
	{
		"id": 1,
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
    res.send(userIn4)
})

router.get('/:1',(req, res) =>{
    let gest1 = userIn4[0]
    res.send(gest1)
})

router.put('/:id', (req, res) =>{
   const userId = req.params.id; // Lấy id của user từ URL
  const updatedData = req.body; // Lấy thông tin cập nhật từ body

  // Tìm user trong mảng và cập nhật thông tin mới
  for (let i = 0; i < userIn4.length; i++) {
    if (userIn4[i].id == userId) {
      userIn4[i].fullname = updatedData.fullname;
      userIn4[i].gender = updatedData.gender;
      userIn4[i].age = updatedData.age;
    
    }
  } 
  res.sendStatus(204);

})
router.post('/', (req, res) => {
      
    const newUser = req.body
    const newID = userIn4.length +1;
    userIn4.push({"id": newID, ...newUser})
  res.status(201).json(userIn4[userIn4.length - 1])

})
router.delete('/:id', (req,res) => {
     const id = Number(req.params.id)
     const userIndex = userIn4.findIndex(user => user.id === id);

  
 if (userIndex <= 0) {
     res.status(404).end('that la qua dacng');
  }

  userIn4.splice(userIndex, 1);

 return res.status(204).end('da xoa roi dcmmmmmm');

});





module.exports = router
 