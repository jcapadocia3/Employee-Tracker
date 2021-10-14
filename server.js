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
  console.log(`--------------------------`)
  console.log(`What would you like to do?`)
  console.log(`--------------------------`)
  inquirer.prompt (
    [{
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
    }]
  );
};

userPrompts();