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
      else if (choices === 'Add a department') {
        addDep();
      }
    })
  
};

userPrompts();

showDepartments = () => {

  console.log('------------------------\n');
  console.log('Showing all departments:\n');
  console.log('------------------------\n');

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

  console.log('------------------\n');
  console.log('Showing all roles:\n');
  console.log('------------------\n');

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

  console.log('----------------------\n');
  console.log('Showing all employees:\n');
  console.log('----------------------\n');

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

  console.log('--------------------\n');
  console.log('Adding a department:\n');
  console.log('--------------------\n');

  inquirer
    .prompt([
      {
        name: 'newDep',
        type: 'input',
        message: 'What is the new department name?',
      }
    ])
    .then((answer) => {

      let dbData = `INSERT INTO department (name) VALUES (?)`;

      db.query(dbData, answer.newDep, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('-----------------\n');
        console.log('New department added!\n');
        console.log('-----------------\n');
         showDepartments();
      });
    });

};
