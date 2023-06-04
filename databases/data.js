const connections = require('./connection')

const get_userDB  = (username) => {
  let sql = 'SELECT * FROM users WHERE username= ?';
  connections.query(sql, [username], (err,result) => {
     if(err){
      throw err;
     }
     return result
  })
  console.log(data);
  return data;
}
module.exports = {get_userDB}