// import inquirer
const inquirer = require('inquirer')
// import mysql2
const mysql = require('mysql2/promise')

// const connection = require('./config.js')
const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View all Departments', 'Add Department', 'view employee by department', 'view employee by manager', 'View budget of a department', 'Quit']
const employeeAdd = ["Employee's First Name ?", " Employee's Last Name ?", "Employee's Role?", "Employee's Manager"]
const roleAdd = ['what is the Roles?', 'Salary of the Role?', 'Role belongs to what department?']
let roles = [];
let managers = [];
let employeeAddQuestions;
const seeTable = require('console.table')
let flag = true;
let rows;
let table, idRole, id, idManagers, idEmployee, nameEmployees, rolesId, role, firstName, lastName, manager, departmentIds, departments, salary, nameRole;






async function main() {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'cms', password: 'T3mp0rl_2020' });

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
            rows = await connection.execute('Select e.id, firstName, lastName, title as role,salary,name as department, manager_id from employee e inner join role r on e.role_id=r.id inner join department d on r.department_id=d.id')
            table = seeTable.getTable(rows[0])
            console.log(table)
            break;
        case choices[1]:
            console.log('adding employee')
            // break;
            // questions to add employee
            rows = await connection.execute('select title from role');
            roles = rows[0].map(data => data.title)
            idRole = await connection.execute('select * from role where `title`=?', ['Manager']);
            idRole = (idRole[0]).length >= 1 ? idRole[0][0] : [];
            rows = await connection.execute('select id,firstName, lastName from employee where role_id = ? ', [idRole.id])
            managers = rows[0].map(data => data.firstName + data.lastName);
            idManagers = rows[0].map(data => data.id);
            console.log("Estos son los managers", managers);
            managers.push('Ninguno')
            employeeAddQuestions = [{
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
            }];

            ({
                firstName,
                lastName,
                role,
                manager,

            } = await inquirer.prompt((managers.length > 1) ? employeeAddQuestions : employeeAddQuestions.slice(0, employeeAddQuestions.length - 1)))


            console.log("Ya finalizamos");
            id = await connection.execute('select id from role where title=?', [role]);


            await connection.execute('insert into employee(firstName,lastName,role_id,manager_id) values(?,?,?,?)', [firstName, lastName, id[0][0].id, (typeof manager == 'undefined' || manager == 'Ninguno') ? null : idManagers[managers.indexOf(manager)]])
            break;


        case choices[2]:
            row = await connection.execute('select e.id,firstName,lastName,role_id from employee e inner join role r on e.role_id=r.id');
            idEmployee = row[0].map(data => data.id);
            nameEmployees = row[0].map(data => data.firstName + " " + data.lastName);
            let { name } = await inquirer.prompt([{
                name: 'name',
                type: 'list',
                choices: nameEmployees,
                message: "Select update role"

            }])
            row = await connection.execute('select * from role');
            roles = row[0].map(data => data.title);
            rolesId = row[0].map(data => data.id);
            ({ role } = await inquirer.prompt([{
                name: 'role',
                type: 'list',
                choices: roles,
                message: 'Select the new role'
            }]));

            //console.log(idEmployee[nameEmployees.indexOf(name)],rolesId[roles.indexOf(role)]);



            await connection.execute('update employee set role_id=? where id=?', [rolesId[roles.indexOf(role)], idEmployee[nameEmployees.indexOf(name)]]);
            break;

        case choices[3]:
            console.log('viewing all roles')
            let result = await connection.execute('SELECT r.id,title,salary,name as department FROM role r INNER JOIN department d on r.department_id=d.id')
            // let result = await connection.execute()
            table = seeTable.getTable(result[0])
            console.log(table)
            break;
        case choices[4]:
            console.log('adding roles')
            // adding role 
            rows = await connection.execute('SELECT * FROM `department`');
            // console.log(await connection.execute('SELECT * FROM `role`'))
            // console.log(rows[0])
            departments = rows[0].map(data => data.name);
            //console.log(roles);
            ({
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
                choices: departments,
            },
            ]))
            //console.log(nameRole, salary, department)
            id = await connection.execute('SELECT * from `department` where `name`= ?', [department])
            //console.log(id[0][0].id)
            // await connection.execute('INSERT INTO `role`(`title`,`salary`,`department_id`) values (?,?,?)', [nameRole, salary, id[0][0].id])
            console.log(await connection.execute('INSERT INTO `role`(`title`,`salary`,`department_id`) values (?,?,?)', [nameRole, salary, id[0][0].id]))
            break;
        case choices[5]:
            // connect to sql2 library and queries database
            row = await connection.execute('SELECT * FROM `department`');
            table = seeTable.getTable(row[0])
            console.log(table)
            console.log('viewing departments')
            break;
        case choices[6]:
            let { departmentName } = await inquirer.prompt([{
                type: 'input',
                name: 'departmentName',
                message: 'What Department?',
            }])
            await connection.execute('INSERT INTO `department`(`name`)VALUES(?)', [departmentName]);
            console.log('adding departments')
            break;
        case choices[7]:
            rows = await connection.execute('select * from department');
            console.log(rows[0]);
            departments = rows[0].map(data => data.name);
            departmentsIds = rows[0].map(data => data.id);
            console.log(departments);
            ({ department } = await inquirer.prompt([{
                name: 'department',
                type: 'list',
                choices: departments,
                message: 'Select the department'

            }]))
            rows = await connection.execute('Select e.id, firstName, lastName, title as role,salary,name as department, manager_id from employee e inner join role r on e.role_id=r.id inner join department d on r.department_id=d.id where d.name=?', [department]);
            table = seeTable.getTable(rows[0])
            console.log(table)
            break;
        case choices[8]:
            rows = await connection.execute('select * from role where title=?', ['Manager']);
            manager = (rows[0].length > 0) ? rows[0][0].id : '';
            rows = await connection.execute('select * from employee where role_id=?', [manager]);
            managers = rows[0].map(data => data.firstName + " " + data.lastName);
            idManagers = rows[0].map(data => data.id);
            ({ manager } = await inquirer.prompt([{
                name: 'manager',
                type: 'list',
                message: 'Select a Manager',
                choices: managers
            }]));

            rows = await connection.execute('Select e.id, firstName, lastName, title as role,salary,name as department, manager_id from employee e inner join role r on e.role_id=r.id inner join department d on r.department_id=d.id where e.manager_id=?', [idManagers[managers.indexOf(manager)]]);
            table = seeTable.getTable(rows[0])
            console.log(table)
            break;
        case choices[9]:
            rows = await connection.execute('select * from department');
            console.log(rows[0]);
            departments = rows[0].map(data => data.name);
            departmentsIds = rows[0].map(data => data.id);
            console.log(departments);
            ({ department } = await inquirer.prompt([{
                name: 'department',
                type: 'list',
                choices: departments,
                message: 'Select the department'

            }]))
            rows = await connection.execute('Select e.id, firstName, lastName, title as role,salary,name as department, manager_id from employee e inner join role r on e.role_id=r.id inner join department d on r.department_id=d.id where d.name=?', [department]);
            salary = rows[0].map(data => parseFloat(data.salary));
            let sum = salary.reduce((acc, cur) => acc + cur);
            table = seeTable.getTable({ TotalSalary: sum })
            console.log(table)
            break;
        case choices[10]:

            flag = false;
            break;

    }
    connection.end();
}

async function init() {
    while (flag) {
        await main();

    }

    console.log('thanks');

}


init();
