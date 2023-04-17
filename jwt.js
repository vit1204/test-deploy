const jsonwebtoken = require('jsonwebtoken')

// const secret = 'qua dang lam lun a'
// const signature = {
//     'name': 'Viet',
//     'class':'12/16'
// }
// const jwt = jsonwebtoken.sign(signature, secret
    
// )
// console.log(jwt);
// const userToken =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmlldCIsImNsYXNzIjoiMTIvMTYiLCJpYXQiOjE2ODE3MzY2MDF9.roYBVoFSUH-ErqDLvE6G8OgSUqGZqn-CjbgqFJUlr2s'
// const secret = 'qua dang lam lun a'

// const jwt = jsonwebtoken.verify(userToken, secret)
// console.log(jwt);

app.post('/auth/login', (req,res) => {
    const ={
        username,
        age,
        email
    }= req.body;

})

app.get('/..', (req,res) => {
    const authorization = req.headers.authorization;
    const token = authorization.substring()
})