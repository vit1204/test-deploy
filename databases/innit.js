const connections = require('./connection')

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS  user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

const createInitialUserQuery = `
INSERT INTO user (username, email, password)
VALUES ('con', '120@gmai.com', 'hihibabbahabahaa');
`;

connections.query(createUserTableQuery, (err, result) => {
  if (err) throw err;
  console.log("table created");
  con.query(createInitialUserQuery, (err, result) => {
    if (err) throw err;
    console.log("user added");
  });
});
connections.query('SELECT * FROM user', (err) => {
        if(err) throw err;
        console.log('show table');
    })