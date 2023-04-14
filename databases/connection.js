 const mysql2 = require('mysql2')
let connections = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: '1204',
  database: 'nodejs'
});

connections.connect((error) => {
  if(error){throw error};
  console.log('Connected');
} )

module.exports = connections;