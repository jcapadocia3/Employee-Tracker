const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "burgaterap44",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const userPrompts = () => {
  console.log(`--------------------------\n`);
  console.log(`What would you like to do?\n`);
  console.log(`--------------------------\n`);

  return inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])

    .then((userRes) => {
      const { choices } = userRes;

      if (choices === "View all departments") {
        showDepartments();
      } else if (choices === "View all roles") {
        showRoles();
      } else if (choices === "View all employees") {
        showEmployees();
      } else if (choices === "Add a department") {
        addDep();
      } else if (choices === "Add a role") {
        addRole();
      } else if (choices === "Add an employee") {
        addEmp();
      } else if (choices === "Update an employee role") {
        updateEmpRole();
      }
    });
};

userPrompts();

showDepartments = () => {
  console.log("------------------------\n");
  console.log("Showing all departments:\n");
  console.log("------------------------\n");

  const dbData = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    userPrompts();
  });
};

showRoles = () => {
  console.log("------------------\n");
  console.log("Showing all roles:\n");
  console.log("------------------\n");

  const dbData = `SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department = department.id`;

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    userPrompts();
  });
};

showEmployees = () => {
  console.log("----------------------\n");
  console.log("Showing all employees:\n");
  console.log("----------------------\n");

  let dbData = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS 'department' FROM employee, role, department WHERE department.id = role.department AND role.id = employee.role ORDER BY employee.id ASC`;

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    userPrompts();
  });
};

addDep = () => {
  console.log("----------------------\n");
  console.log("Adding a department...\n");
  console.log("----------------------\n");

  inquirer
    .prompt([
      {
        name: "newDep",
        type: "input",
        message: "What is the new department name?",
      },
    ])
    .then((answer) => {
      let dbData = `INSERT INTO department (name) VALUES (?)`;

      db.query(dbData, answer.newDep, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log("---------------------\n");
        console.log("New department added!\n");
        console.log("---------------------\n");
        showDepartments();
      });
    });
};

addRole = () => {
  console.log("----------------\n");
  console.log("Adding a role...\n");
  console.log("----------------\n");

  const depDb = "SELECT * FROM department";

  db.query(depDb, (err, res) => {
    if (err) {
      console.log(err);
    }
    let depArray = [];

    res.forEach((department) => {
      depArray.push(department.name);
    });

    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role part of?",
          choices: depArray,
        },
      ])
      .then((answer) => {
        newRoleInfo(answer);
      });

    const newRoleInfo = (depData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of the new role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
        ])
        .then((answer) => {
          let departmentId;

          res.forEach((department) => {
            if (depData.departmentName === department.name) {
              departmentId = department.id;
            }
          });

          let dbData = `INSERT INTO role (title, salary, department) VALUES (?, ?, ?)`;
          let newDataArray = [answer.newRole, answer.salary, departmentId];

          db.query(dbData, newDataArray, (err) => {
            if (err) {
              console.log(err);
            }
            console.log("---------------\n");
            console.log("New role added!\n");
            console.log("---------------\n");
            showRoles();
          });
        });
    };
  });
};

const addEmp = () => {
  console.log("-------------------\n");
  console.log("Adding an employee:\n");
  console.log("-------------------\n");

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
      const empName = [answer.firstName, answer.lastName];
      const roleDb = `SELECT role.id, role.title FROM role`;

      db.query(roleDb, (err, data) => {
        if (err) {
          console.log(err);
        }

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the new employee's role?",
              choices: roles,
            },
          ])

          .then((roleChoice) => {
            const role = roleChoice.role;
            empName.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) {
                console.log(err);
              }
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the new employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  empName.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role, manager)
                                  VALUES (?, ?, ?, ?)`;
                  db.query(sql, empName, (err) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log("-------------------\n");
                    console.log("New employee added!\n");
                    console.log("-------------------\n");
                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

const updateEmpRole = () => {
  console.log("----------------------------\n");
  console.log("Updating an employee's role:\n");
  console.log("----------------------------\n");
  let sqlInfo = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role" FROM employee, role, department WHERE department.id = role.department AND role.id = employee.role`;
  db.query(sqlInfo, (err, res) => {
    if (err) {
      console.log(err);
    }
    let namesArray = [];
    res.forEach((employee) => {
      namesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    let sqlInfo = `SELECT role.id, role.title FROM role`;
    db.query(sqlInfo, (err, res) => {
      if (err) {
        console.log(err);
      }
      let rolesArray = [];
      res.forEach((role) => {
        rolesArray.push(role.title);
      });
      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee needs to have their role updated?",
            choices: namesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is his/her new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newRoleId, employeeId;

          res.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newRoleId = role.id;
            }
          });

          res.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role = ? WHERE employee.id = ?`;
          db.query(sqls, [newRoleId, employeeId], (err) => {
            if (err) {
              console.log(err);
            }
            console.log("----------------------\n");
            console.log("Employee role updated!\n");
            console.log("----------------------\n");
            showEmployees();
          });
        });
    });
  });
};
