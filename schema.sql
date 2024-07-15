-- Drop database if it already exists to fully update and avoid duplication, and create afterwards
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

-- Connect to the new database
\c employee_tracker;

-- Creates the department table
CREATE TABLE department (
  id SERIAL PRIMARY KEY,                -- Creates a unique ID for each department
  name VARCHAR(30) UNIQUE NOT NULL      -- Makes sure the name of each department is unique
);

-- Creates the role table
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,    -- Makes it so the role title must be unique
  salary DECIMAL NOT NULL,              -- Makes it so salary cannot be null, uses DECIMAL for more precision if needed
  department_id INTEGER NOT NULL REFERENCES department(id) -- References department table
);

-- Creates the employee table
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES role(id), -- References role table
  manager_id INTEGER REFERENCES employee(id)    -- Self-referential key allowing each employee to reference another employee as their manager, if needed
);