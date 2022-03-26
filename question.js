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
let rows;
let roles;
let managers;





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
            rows = await connection.execute('select title from role');
            roles = rows[0].map(data => data.title)
            rows = await connection.execute('select firstName, lastName from employee where role_id = 1 ')
            managers = rows[0].map(data => data.firstName + data.lastName);
            console.log(managers)
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
                type: 'list',
                name: 'role',
                message: employeeAdd[2],
                choices: roles
            },
            {
                type: 'list',
                name: 'manager',
                message: employeeAdd[3],
                choices: managers
            },
            ])
            console.log(firstName, lastName, role, manager)
            break;


        case choices[2]:
            console.log('updating role')
        // break;

        case choices[3]:
            console.log('viewing all roles')
            let result = await connection.execute('SELECT * FROM role r INNER JOIN department d on r.department_id=d.id')
            // let result = await connection.execute()
            const table = seeTable.getTable(result[0])
            console.log(table)
            break;
        case choices[4]:
            console.log('adding roles')
            // adding role 
            rows = await connection.execute('SELECT * FROM `department`');
            // console.log(await connection.execute('SELECT * FROM `role`'))
            // console.log(rows[0])
            roles = rows[0].map(data => data.name)
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
            let id = await connection.execute('SELECT * from `department` where `name`= ?', [department])
            console.log(id[0][0].id)
            // await connection.execute('INSERT INTO `role`(`title`,`salary`,`department_id`) values (?,?,?)', [nameRole, salary, id[0][0].id])
            console.log(await connection.execute('INSERT INTO `role`(`title`,`salary`,`department_id`) values (?,?,?)', [nameRole, salary, id[0][0].id]))
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

