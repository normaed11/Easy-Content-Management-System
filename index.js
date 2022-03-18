// import inquirer
const inquirer = require('inquirer')
// import mysql2
const mysql = require('mysql2')
//  import console.table
const cTable = require('console.table')
// create the connection to database 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cms'
});