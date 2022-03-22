// import inquirer
const inquirer = require('inquirer')
const choices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View all Departments', 'Add Department', 'Quit']
const employeeAdd = ["Employee's First Name ?", " Employee's Last Name ?", "Employee's Role?", "Employee's Manager"]
const departmentsAdd = ['What Department?']
const roleAdd = ['what is the Roles?', 'Salary of the Role?', 'Role belongs to what department?']

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
        break;
    case choices[2]:
        console.log('updating role')
        break;
    case choices[3]:
        console.log('viewing all roles')
        break;
    case choices[4]:
        console.log('adding roles')
        break;
    case choices[5]:
        // connect to sql2 library and queries database
        connect.query('SELECT * FROM `department`', (err, result) => {
            if (err) throw err;
            console.log(result)
        })
        console.log('viewing departments')
        break;
    case choices[6]:
        let { departmentName } = await inquirer.prompt([{
            type: 'input',
            name: 'departmentName',
            message: 'What Department?',
        }])
        connect.query('INSERT INTO `departement`(`name`)VALUES(?)', [departmentName], (err) => {
            if (err) throw err;
        })
        console.log('adding departments')
        break;
    case choices[7]:
        console.log('quit')
        break;

}