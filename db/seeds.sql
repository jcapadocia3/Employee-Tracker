-- Pre-entered data to be stored in database and shown upon 'npm start' when user chooses to show existing data via inquirer prompts

-- Pre-entered data in 'department table'
INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

-- Pre-entered data in 'role table'
INSERT INTO role (title, salary, department)
VALUES ("Sales Team Lead", 45000, 1),
       ("Salesperson", 35000, 1),
       ("Lead Engineer", 98000, 2),
       ("Software Engineer", 80000, 2),
       ("Account Manager", 70000, 3),
       ("Accountant", 59000, 3),
       ("Legal Team Lead", 90000, 4),
       ("Lawyer", 75000, 4);

-- Pre-entered data in 'employee table'
INSERT INTO employee (first_name, last_name, role, manager)
VALUES ("Cheryl", "DeGuzman", 1, null),
       ("Mary", "LittleLamb", 2, 1),
       ("Bat", "Man", 3, null),
       ("Ro", "Bin", 4, 3),
       ("Chuck", "Norris", 5, null),
       ("Hokey", "Pokey", 6, 5),
       ("Tom", "Jerry", 7, null),
       ("Thomas", "Sawyer", 8, 7);
