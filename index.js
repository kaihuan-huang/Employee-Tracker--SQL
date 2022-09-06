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
            case 'View All Employees By Department': return promptAllEmployeesByDepartment();
            case 'View Department Budgets': return promptDepartmentBudgets();
        }
            

    })
}

const promptAllEmployees = () => {
    let sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.department_name AS 'department',
                role.salary,
                employee.manager_id AS manager 
                FROM employee, role, department
                WHERE department.id = role.department_id
                AND role.id = employee.role_id
                ORDER BY employee.id`;
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.log(sql);
        promptUser();
    });
};

const promptAllRoles = () => {
    let sql = `SELECT role.id, role.title, 
                department.department_name AS 'department' 
                FROM role
                INNER JOIN department ON department.id = role.department_id`;
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.log(sql);
        promptUser();
    });
}

const promptAllDepartments = () => {
    let sql = `SELECT * FROM employees.department`;
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.log(sql);
        promptUser();
    });
}

const promptAllEmployeesByDepartment = () => {
    let sql = `SELECT employee.first_name, employee.last_name, department.department_name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id = role_id
                LEFT JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.log(sql);
        promptUser();
    });
}

const promptDepartmentBudgets = () => {
    let sql = `SELECT department_id AS id,
                department.department_name AS department,
                SUM(salary) AS budget 
                FROM role 
                INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.log(sql);
        promptUser();
    });
};

//Add 
const addEmployee = () =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },

    ]).then(answer => {
        const addEmployeeInfo = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            console.log(roles);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message:"What is the employee's role?",
                    choices: roles
                }
            ])


        })

    })
}
