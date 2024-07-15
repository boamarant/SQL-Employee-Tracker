// Requiring dependencies
const inquirer = require('inquirer');
const { Client } = require('pg');
require('dotenv').config();

// Database client setup. Using dotenv for security.
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

client.connect();

// Main menu function
function mainMenu() {
    // Allows the user to choose what they would like to choose
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
    // Using switch to create a different outcome for each response
  ]).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        client.end();
        break;
    }
  });
}

// Function to view all departments
async function viewAllDepartments() {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
}

// Function to view all roles
async function viewAllRoles() {
  const res = await client.query(`SELECT role.id, role.title, department.name AS department, role.salary
                                  FROM role
                                  JOIN department ON role.department_id = department.id`);
  console.table(res.rows);
  mainMenu();
}

// Function to view all employees
async function viewAllEmployees() {
  const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                                  manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                                  FROM employee
                                  JOIN role ON employee.role_id = role.id
                                  JOIN department ON role.department_id = department.id
                                  LEFT JOIN employee manager ON employee.manager_id = manager.id`);
  console.table(res.rows);
  mainMenu();
}

// Function to add a department
async function addDepartment() {
  const answer = await inquirer.prompt([
    {
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ]);
  await client.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
  console.log('Department added!');
  mainMenu();
}

// Function to add a role
async function addRole() {
    // Fetch all departments from DB
  const departments = await client.query('SELECT * FROM department');
    // Mapping the department rows to options for inquirer
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id
  }));
    // Prompt the user for information
  const answers = await inquirer.prompt([
    {
      name: 'title',
      message: 'Enter the name of the role:'
    },
    {
      name: 'salary',
      message: 'Enter the salary of the role:'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departmentChoices
    }
  ]);
  // Adding new roles into the database
  await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
  console.log('Role added!');
  mainMenu();
}

// Function to add an employee
async function addEmployee() {
    // Fetch all roles from DB
  const roles = await client.query('SELECT * FROM role');
    // Map the role rows to options for inquirer
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));
  // Fetch all employees to populate manager choices
  const employees = await client.query('SELECT * FROM employee');
  // Map employee rows to options for managers
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));
  // Add an option for no manager
  managerChoices.unshift({ name: 'None', value: null });
  
  // Prompt the user for information
  const answers = await inquirer.prompt([
    {
      name: 'first_name',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role for the employee:',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager for the employee:',
      choices: managerChoices
    }
  ]);
  // Insert new employee into DB
  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
  console.log('Employee added!');
  // Return to main menu
  mainMenu();
}

// Function to update an employee's role
async function updateEmployeeRole() {
    // Fetch all employees from DB
  const employees = await client.query('SELECT * FROM employee');
    // Map employee rows to options for inquirer
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));
    // Fetch all roles from DB
  const roles = await client.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));
  
  // Prompt the user for information
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role for the employee:',
      choices: roleChoices
    }
  ]);
  // Update employees role
  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
  console.log('Employee role updated!');
  // Return to main menu
  mainMenu();
}

// Start the application
mainMenu();