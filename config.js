// import mysql2
const mysql = require('mysql2/promise')
// create the connection to database 
const connection = async () => await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cms',
    password: 'Jones2705!'
});
module.exports = connection;