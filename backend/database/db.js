import mysql from 'mysql2'

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "12345",
    database: "sushma_db",
  }
);

db.connect((err)=>{
  if(err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database successfully!');
  }
})

export default db;