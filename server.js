const mysql = require('mysql2');
const inquirer = require("inquirer");
const cTable = require('console.table'); 

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'burgaterap44',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

const userPrompts = () => {

  console.log(`--------------------------\n`)
  console.log(`What would you like to do?\n`)
  console.log(`--------------------------\n`)

  return inquirer
    .prompt ([
      {
        type: 'list',
        name: 'choices',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role'
        ]
      }
    ])
  

    .then((userRes) => {

      const { choices } = userRes;

      if (choices === 'View all departments') {
        showDepartments();
      }
      else if (choices === 'View all roles') {
        showRoles();
      }
      else if (choices === 'View all employees') {
        showEmployees();
      }
    })
  
};

userPrompts();

showDepartments = () => {

  console.log('------------------------\n');
  console.log('Showing all departments:\n');
  console.log('------------------------\n');

  db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });
};

showRoles = () => {

  console.log('------------------------\n');
  console.log('Showing all roles:\n');
  console.log('------------------------\n');

  db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
  });
};

showEmployees = () => {

  console.log('------------------------\n');
  console.log('Showing all employees:\n');
  console.log('------------------------\n');

  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });
};
