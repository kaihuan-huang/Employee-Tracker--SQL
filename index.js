// MySQL2 package to connect to your MySQL database and perform queries

//the Inquirer package to interact with the user via the command line

//the console.table package (Links to an external site.) to print MySQL rows to the console.

const connection = require("./config/connection");
const inquirer = require("inquirer");
const figlet = require("figlet");
const chalk = require("chalk");
const { response } = require("express");
const { message } = require("statuses");
const { reject } = require("lodash");

//Database connect and starter Title
connection.connect((error) => {
  if (error) throw error;
  console.log(
    chalk.greenBright.bold(
      `=================================================================================================`
    )
  );
  console.log(``);
  console.log(chalk.yellowBright.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(
    `                                                                        ` +
      chalk.yellowBright.bold("Created By: Kaihuan Huang")
  );
  console.log(
    chalk.greenBright.bold(
      `=================================================================================================`
    )
  );
  promptUser();
});

//promptUser()
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please select one option from below:",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Update Employee Role",
          "Delete Employee",
          "Delete Role",
          "Exit",
        ],
      },
    ])
    .then((data) => {
      console.log(data);
      switch (data.options) {
        case "View All Employees":
          return promptAllEmployees();
        case "View All Roles":
          return promptAllRoles();
        case "View All Departments":
          return promptAllDepartments();
        case "View All Employees By Department":
          return promptAllEmployeesByDepartment();
        case "View Department Budgets":
          return promptDepartmentBudgets();
        case "Add Employee":
          return addEmployee();
        case "Add Role":
          return addRole();
        case "Add Department":
          return addDepartment();
        case "Update Employee Role":
          return updateEmployeeRole();
        case "Delete Employee":
          return deleteEmployee();
        case "Delete Role":
          return deleteRole();
        default:
          end();
      }
    });
};

// --------------------------------------------------- View --------------------------------------------------------------------
function end(){
  console.log('Bye!')
  process.exit();
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
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, response) => {
      if (error) reject(error);
      console.table(response);
      resolve(response);
      promptUser();
    });
  });
};

const promptAllRoles = () => {
  let sql = `SELECT role.id, role.title, 
                department.department_name AS 'department' 
                FROM role
                INNER JOIN department ON department.id = role.department_id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};
//     connection.promise().query(sql, row)
//     .then(response => {
//         console.table(response);
//         promptUser();
//     }).catch(error => {
//         throw error;
//     });
// }

// // get the client
// const mysql = require('mysql2');
// // create the connection
// const con = mysql.createConnection(
//   {host:'localhost', user: 'root', database: 'test'}
// );
// con.promise().query("SELECT 1")
//   .then( ([rows,fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then( () => con.end());

const promptAllDepartments = () => {
  let sql = `SELECT * FROM employees.department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

const promptAllEmployeesByDepartment = () => {
  let sql = `SELECT employee.first_name, employee.last_name, department.department_name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

const promptDepartmentBudgets = () => {
  let sql = `SELECT department_id AS id,
                department.department_name AS department,
                SUM(salary) AS budget 
                FROM role 
                INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

// --------------------------------------------------- ADD --------------------------------------------------------------------
//Add New Employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      const addEmployeeInfo = [answer.firstName, answer.lastName];
      console.log(addEmployeeInfo);
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        console.table("roleSql", data);
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        console.table(roles);
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            addEmployeeInfo.push(role);

            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (error, data) => {
              if (error) throw error;
              console.table("managerSql", data);
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  console.log(manager);
                  addEmployeeInfo.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                  connection.query(sql, addEmployeeInfo, (error) => {
                    if (error) throw error;
                    console.log("sql", sql);
                    console.log("Employee has been addad!");
                    promptAllEmployees();
                  });
                });
            });
          });
      });
    });
};

//Add New Role
const addRole = () => {
  const sql = "Select * FROM role";
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let roleNamesArray = [];
    response.forEach((role) => {
      roleNamesArray.push(role.title);
    });
    console.table("addRole", response);
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentName",
          message: "Which is this new role in?",
          choices: roleNamesArray,
        },
      ])
      .then((answer) => {
        console.log("departmentName", answer);
        if (answer.departmentName === "Create Department") {
          return addDepartment();
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the title of the new role?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary of the new role?",
          },
        ])
        .then((answer) => {
          console.log("addRoleResume", answer);
          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });
          let sql = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
          let addRoleInfo = [answer.title, answer.salary, departmentId];

          connection.query(sql, addRoleInfo, (error) => {
            if (error) throw error;
            console.table("addRoleInfo", addRoleInfo);
            console.log("New Role Created!");
            promptAllRoles();
          });
        });
    };
  });
};

// Add New Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What is the name of the new department?",
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department(department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.table(response);
        console.log(answer.newDepartment + ` Department successfully created!`);
        promptAllDepartments();
      });
    });
};

// --------------------------------------------------- UPDATE --------------------------------------------------------------------
//'Update Employee Role'
// const updateEmployeeRole = () => {
//   let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
//                     FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
//   connection.query(sql, (error, response) => {
//     if (error) throw error;
//     console.table("updateEmployeeRole", response);

//     let employeeNameArray = [];
//     let sqlRoleName = `SELECT role.title FROM role`;
//     let roleTitlesArray = [];
//     response.forEach((employee) => {
//       employeeNameArray.push(employee.first_name, employee.last_name);
//     });
//     console.table("updateEmployeeRole", response);
//     inquirer
//       .prompt([
//         {
//           type: "list",
//           name: "roleName",
//           message: "Which is this new role in?",
//           choices: roleTitlesArray,
//         },
//       ])
//       .then((answer) => {
//         console.log("departmentName", answer);
//         if (answer.departmentName === "Create Department") {
//           return addDepartment();
//         }
//       });
//   });
// };

const updateEmployeeRole = () => {
  promptAllEmployees().then((rows) => {
    console.log("row", rows);
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    let sql = `SELECT role.id, role.title FROM role`;
    connection.query(sql, (error, role) => {
      if (error) throw error;
      console.table(role);
      const roleChoices = role.map(({ id, title }) => ({
        title: title,
        value: id,
      }));

      inquirer
      .prompt([
        {
          type: "list",
          name: "employeeToUpdate",
          choices: employeeChoices,
          message: "Pick one employee to update their role.",
        },
        {
          type: "list",
          name: "roleToUpdate",
          choices: roleChoices,
          message: "Pick one role to update.",
        },
      ])
      .then((data) => {
        console.log(data.employeeToUpdate);
        console.log(data.roleToUpdate);
        let sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        connection.query(sql, [data.roleToUpdate, data.employeeToUpdate], (error) => {
          if (error) throw error;
          console.log("Employee Deleted");
          promptAllEmployees();
        });
      });
    });
  });
};

// --------------------------------------------------- DELETE --------------------------------------------------------------------

const deleteEmployee = () => {
  promptAllEmployees().then((rows) => {
    console.log("row", rows);
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeToDelete",
          choices: employeeChoices,
          message: "Pick one employee to delete",
        },
      ])
      .then((answer) => {
        console.log(answer.employeeToDelete);
        let sql = `DELETE FROM employee WHERE id = ?`;
        connection.query(sql, answer.employeeToDelete, (error) => {
          if (error) throw error;
          console.log("Employee Deleted");
          promptAllEmployees();
        });
      });
  });
};

// const deleteRole = () => {
//   promptAllRoles().then((rows) => {
//     console.log("row", rows);
//     let employees = rows;
//     const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//       name: `${first_name} ${last_name}`,
//       value: id,
//     }));
//     inquirer
//       .prompt([
//         {
//           type: "list",
//           name: "employeeToDelete",
//           choices: employeeChoices,
//           message: "Pick one employee to delete",
//         },
//       ])
//       .then((answer) => {
//         console.log(answer.employeeToDelete);
//         let sql = `DELETE FROM employee WHERE id = ?`;
//         connection.query(sql, answer.employeeToDelete, (error) => {
//           if (error) throw error;
//           console.log("Employee Deleted");
//           promptAllEmployees();
//         });
//       });
//   });
// };

/*
 Employees thinking process, pseudo code:
//write a function to do the following:
1- find all employees for the database, then in a promise return all the employees
2. loop through the employees array and save all the data in a new array variable
3. start with a prompt, to ask: which employee’s role do you want to update? pass the choices property
*/
// // Update employee

// app.get("/updateemployee/:id", (req, res) => {

//     let newName = "Updated name";

//     let sql = `UPDATE employee SET name = '${newName}' WHERE id = ${req.params.id}`;

//     let query = db.query(sql, (err) => {

//       if (err) {

//         throw err;

//       }

//       res.send("Post updated...");

//     });

//   });

// --------------------------------------------------- Delete --------------------------------------------------------------------
