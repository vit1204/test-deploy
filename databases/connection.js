
 const mysql2 = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

let connections = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DataBase,
  
});

connections.connect(() => {
  console.log('connected');
} )

module.exports = connections;