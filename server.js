// Variables used to allow access to downloaded packages functionality and pre-written code
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "burgaterap44",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// Begin user prompts via inquirer
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
          // All actions for how user can interact with database
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Fin!"
        ],
      },
    ])

    // Based on user choice, call on specific function
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
      } else if (choices === "Fin!") {
        db.end();
      }
    });
};

// Initiate user prompt on 'npm start'
// This function will be called on after each function is completed
userPrompts();

// Function to show 'department table' data in schema.sql file
showDepartments = () => {
  console.log("--------------------------\n");
  console.log("Showing all departments...\n");
  console.log("--------------------------\n");

  // Query string to determine what information from database will be shown in generated table
  const dbData = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    // Uses 'console.table' package to generate table in command line
    console.table(res);
    userPrompts();
  });
};

// Function to show 'roles table' data in schema.sql file
showRoles = () => {
  console.log("--------------------\n");
  console.log("Showing all roles...\n");
  console.log("--------------------\n");

  // Query string to determine what information from database will be shown in generated table
  const dbData = `SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department = department.id`;

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    // Uses 'console.table' package to generate table in command line
    console.table(res);
    userPrompts();
  });
};

// Function to show 'employee table' data in schema.sql file
showEmployees = () => {
  console.log("------------------------\n");
  console.log("Showing all employees...\n");
  console.log("------------------------\n");

  // Query string to determine what information from database will be shown in generated table
  let dbData = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, concat(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee employee LEFT JOIN employee manager ON employee.manager = manager.id INNER JOIN role ON employee.role = role.id INNER JOIN department ON role.department = department.id ORDER BY ID ASC";

  db.query(dbData, (err, res) => {
    if (err) {
      console.log(err);
    }
    // Uses 'console.table' package to generate table in command line
    console.table(res);
    userPrompts();
  });
};

// Function to add a new department in database within the 'department table'
addDep = () => {
  console.log("--------------------------\n");
  console.log("Adding a new department...\n");
  console.log("--------------------------\n");

  // Begin prompt to determine new department name to be added
  inquirer
    .prompt([
      {
        name: "newDep",
        type: "input",
        message: "What is the new department name?",
      },
    ])
    .then((answer) => {
      // Query string to determine where department should be added in database
      let dbData = `INSERT INTO department (name) VALUES (?)`;

      db.query(dbData, answer.newDep, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log("---------------------\n");
        console.log("New department added!\n");
        console.log("---------------------\n");
        // Shows new department added to database and initates 'userPrompts()' for user to choose another action 
        showDepartments();
      });
    });
};

// Function to add a new role in database within the 'role table'
addRole = () => {
  console.log("--------------------\n");
  console.log("Adding a new role...\n");
  console.log("--------------------\n");

  // Query string to select existing data from database in 'department table'
  const depDb = "SELECT * FROM department";

  db.query(depDb, (err, res) => {
    if (err) {
      console.log(err);
    }
    // Create empty array to push data into
    let depArray = [];

    res.forEach((department) => {
      // Push all department names from database in 'department table' into empty array -- depArray
      depArray.push(department.name);
    });

    // Begin prompt to determine which department a new role will be added to
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role part of?",
          // User choices determined by data pushed into depArray
          choices: depArray,
        },
      ])
      .then((answer) => {
        newRoleInfo(answer);
      });

    const newRoleInfo = (depData) => {
      // Begin prompts to determine pertinent new role information
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

          // Loop to determine department ID associated with department user chose
          res.forEach((department) => {
            if (depData.departmentName === department.name) {
              departmentId = department.id;
            }
          });

          // Query string to determine where role should be added in database
          let dbData = `INSERT INTO role (title, salary, department) VALUES (?, ?, ?)`;
          // Array to take in new role information entered by user and department ID associated with department user chose
          let newDataArray = [answer.newRole, answer.salary, departmentId];

          db.query(dbData, newDataArray, (err) => {
            if (err) {
              console.log(err);
            }
            console.log("---------------\n");
            console.log("New role added!\n");
            console.log("---------------\n");
            // Shows new role added to database and initates 'userPrompts()' for user to choose another action
            showRoles();
          });
        });
    };
  });
};

// Function to add a new employee in database within the 'employee table'
const addEmp = () => {
  console.log("------------------------\n");
  console.log("Adding a new employee...\n");
  console.log("------------------------\n");

  // Begin prompts to determine new employee name
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
      // Puts user input in an array
      const empName = [answer.firstName, answer.lastName];
      // Query string to select existing data from database in 'role table'
      const roleDb = `SELECT role.id, role.title FROM role`;

      db.query(roleDb, (err, data) => {
        if (err) {
          console.log(err);
        }

        // Allows user to choose to from existing roles in database via inquirer prompt that follows
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
            // Pushes role choice into empName array
            empName.push(role);

            // Query string to select existing data from database in 'employee table'
            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) {
                console.log(err);
              }
              // Allows user to choose to from existing employees in database via inquirer prompt that follows, to select the new employee's manager
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
                  // Pushes manager choice into empName array
                  empName.push(manager);
                  // Query string to insert new data from user input into database in 'employee table'
                  const sql = `INSERT INTO employee (first_name, last_name, role, manager) VALUES (?, ?, ?, ?)`;
                  db.query(sql, empName, (err) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log("-------------------\n");
                    console.log("New employee added!\n");
                    console.log("-------------------\n");
                    // Shows new employee added to database and initates 'userPrompts()' for user to choose another action
                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

// Function to update an employee's role in database within the 'employee table'
const updateEmpRole = () => {
  console.log("------------------------------\n");
  console.log("Updating an employee's role...\n");
  console.log("------------------------------\n");
  // Query string to select existing data from database
  let sqlInfoEmp = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role" FROM employee, role, department WHERE department.id = role.department AND role.id = employee.role`;
  db.query(sqlInfoEmp, (err, res) => {
    if (err) {
      console.log(err);
    }
    // Creates empty array
    let namesArray = [];
    res.forEach((employee) => {
      // Pushes all existing employee names in database into nameArray
      namesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    // Query string to select existing data from database in 'role table'
    let sqlInfoRole = `SELECT role.id, role.title FROM role`;
    db.query(sqlInfoRole, (err, res) => {
      if (err) {
        console.log(err);
      }
      // Creates empty array
      let rolesArray = [];
      res.forEach((role) => {
        // Pushes all existing role titles in database into rolesArray
        rolesArray.push(role.title);
      });
      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee needs to have their role updated?",
            // Choices presented are based on data pushed into namesArray
            choices: namesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is his/her new role?",
            // Choices presented are based on data pushed into rolesArray
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newRoleId, employeeId;

          // Loop to associate role ID based on user choice of role title
          res.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newRoleId = role.id;
            }
          });

          // Loop to associate employee ID based on user choice of employee's full name
          res.forEach((employee) => {
            if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
              employeeId = employee.id;
            }
          });

          // Query string to update employee role in database
          let sqls = `UPDATE employee SET employee.role = ? WHERE employee.id = ?`;
          db.query(sqls, [newRoleId, employeeId], (err) => {
            if (err) {
              console.log(err);
            }
            console.log("------------------------\n");
            console.log("Employee's role updated!\n");
            console.log("------------------------\n");
            // Shows existing employee's updated role via the 'showEmployees()' table generated and initates 'userPrompts()' for user to choose another action
            showEmployees();
          });
        });
    });
  });
};
