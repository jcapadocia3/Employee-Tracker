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
    ]);
  

    .then((userRes) => {

      const { choices } = userRes;

      if (choices === 'View all departments') {
        showDepartments = () => {
          console.log('Showing all departments...\n');
          const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
        
          connection.promise().query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            userPrompts();
          })
        }
      }
    })
  
};

userPrompts();