DROP DATABASE IF EXISTS Employees_db;
CREATE DATABASE Employees_db;

USE Employees_db;

DROP TABLE IF EXISTS department;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

DROP TABLE IF EXISTS role;

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title name VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department_id(id) ON DELETE CASCADE --使用ON DELETE CASCADE约束在删除父表中的行时自动删除子表中的行
);

DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE, --使用ON DELETE CASCADE约束在删除父表中的行时自动删除子表中的行
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL --On Delete Set Null 子句如果父表中的相应记录被删除，则将子表中定义为外键的列的所有记录设置为 Null。
);