// MySQL2 package to connect to your MySQL database and perform queries

//the Inquirer package to interact with the user via the command line

//the console.table package (Links to an external site.) to print MySQL rows to the console.

const connection = require('./config/connection');
const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');

//Database connect and starter Title
connection.connect((error)=>{
    if (error) throw error;
    console.log(chalk.greenBright.bold(`=================================================================================================`));
    console.log(``);
    console.log(chalk.yellowBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                                                                        ` + chalk.yellowBright.bold('Created By: Kaihuan Huang'));
    console.log(chalk.greenBright.bold(`=================================================================================================`));
    promptUser();
});

//promptUser() 
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: "Please select one option from below:",
            choices: [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View Department Budgets',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ])
    .then((data) => {
        const { options } = data;
        console.log(data);
        switch(options.data){
            case 'View All Employees': return promptAllEmployees();
            case 'View All Roles': return promptAllRoles();
            case 'View All Departments': return promptAllDepartments();
        }
            

    })
}

// const promptAllEmployees = () => {
//     let sql = `SELECT employee.id,
//                 employee.first_name,
//                 employee.last_name,
//                 role.title,
//                 department.name,
//                 role.salary,
//                 employee.manager_id, 
//                 FROM employee, role, department 
//                 WHERE department.id = role.department_id 
//                 AND role.id = employee.role_id 
//                 ORDER BY employee.id ASC`;
//     connection.promise().query(sql, (err, res) => {
//         if (err) throw err;
//         console.log(sql);
//         promptUser();
//     });
// };

// const promptAllRoles = () => {
//     let sql = ` `
// }