# SQL-Employee-Tracker

## Description

This project was completed for the Columbia Coding Bootcamp. The purpose of this project was to create an employee tracking application using Node.js, Inquirer, and PostgreSQL. This application can be used to keep track of employees within a company across multiple departments for organization purposes.

## Installation

This project must be downloaded and run using a command terminal or shell. 

## Usage

To run the project, open a PostgreSQL shell and run "\i schema.sql", then open a second terminal to run "node index.js". To avoid errors, please CREATE items in the following order: Department -> Role -> Employee. And DELETE items in the following order: Employee -> Role -> Department. If a manager employee is going to be deleted, any employee they are the manager of must be deleted FIRST.

## Credits

I referenced previous projects and examples from the Columbia University Coding Bootcamp to assist in creating this page. ChatGPT helped me work through bugs that I was having. 

## Features

The application allows users to enter departments, roles, and employees within their company. You can set salaries for different roles, as well as set managers of other employees. The application will allow the user to then view or delete any departments, roles, or employees they have previously created.
