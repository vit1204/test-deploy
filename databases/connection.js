
 const mysql2 = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

let connections = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DataBase,
  
});

connections.getConnection(() => {
  console.log('connected to db');
}
  
)

module.exports = connections