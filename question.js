// import inquirer
const inquirer = require('inquirer')
// import mysql2
const mysql = require('mysql2/promise')

// const connection = require('./config.js')
const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View all Departments', 'Add Department', 'Quit']
const employeeAdd = ["Employee's First Name ?", " Employee's Last Name ?", "Employee's Role?", "Employee's Manager"]
const roleAdd = ['what is the Roles?', 'Salary of the Role?', 'Role belongs to what department?']
const seeTable = require('console.table')
const { listenerCount } = require('./config.js')
let flag = true;
let rows, fields;




async function main() {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'cms', password: 'Jones2705!' });

    // start inquirer
    let mainMenuAnswers = await inquirer.prompt([{
        type: 'list',
        name: 'startMenu',
        message: 'What would like to do ?',
        choices: choices
    }]);
    switch (mainMenuAnswers.startMenu) {
        case choices[0]:
            console.log('showing employees')
            break;
        case choices[1]:
            console.log('adding employee')
            // break;
            // questions to add employee
            let {

                firstName,
                lastName,
                role,
                manager,

            } = await inquirer.prompt([{
                type: 'input',
                name: 'firstName',
                message: employeeAdd[0],
            },
            {
                type: 'input',
                name: 'lastName',
                message: employeeAdd[1],
            },
            {
                type: 'input',
                name: 'role',
                message: employeeAdd[2],
            },
            {
                type: 'input',
                name: 'manager',
                message: employeeAdd[3],
            },
            ])
            console.log(firstName, lastName, role, manager)
            break;


        case choices[2]:
            console.log('updating role')
        // break;

        case choices[3]:
            console.log('viewing all roles')
            break;
        case choices[4]:
            console.log('adding roles')
            // adding role 
            rows = await connection.execute('SELECT * FROM `department`');
            // console.log(await connection.execute('SELECT * FROM `role`'))
            // console.log(rows[0])
            let roles = rows[0].map(data => data.name)
            let {
                nameRole,
                salary,
                department,
            } = await inquirer.prompt([{
                type: 'input',
                name: 'nameRole',
                message: roleAdd[0],
            },
            {
                type: 'input',
                name: 'salary',
                message: roleAdd[1],
            },
            {
                type: 'list',
                name: 'department',
                message: roleAdd[2],
                choices: roles,
            },
            ])
            console.log(nameRole, salary, department)
            break;
        case choices[5]:
            // connect to sql2 library and queries database
            connection.query('SELECT * FROM `department`', (err, result) => {
                if (err) throw err;
                const table = seeTable.getTable(result)
                console.log(table)
            })
            console.log('viewing departments')
            break;
        case choices[6]:
            let { departmentName } = await inquirer.prompt([{
                type: 'input',
                name: 'departmentName',
                message: 'What Department?',
            }])
            connection.query('INSERT INTO `department`(`name`)VALUES(?)', [departmentName], (err) => {
                if (err) throw err;
            })

            console.table('adding departments')
            break;
        case choices[7]:
            console.log('quit')
            flag = false;
            break;

    }
    connection.end();
}

// while (flag) {
main();
// }

