
 const mysql2 = require('mysql2')
import dotenv from 'dotenv'
dotenv.config();


let connections = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DataBase,
  
});

connections.connect((error) => {
  if(error){throw error};
  console.log('Connected');
} )

module.exports = connections;