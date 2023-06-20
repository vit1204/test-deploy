
 const mysql2 = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const connections = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
});

connections.connect(() => {
  console.log('connected to db');
}
  
)

module.exports = connections