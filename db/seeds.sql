INSERT INTO department (department_name)
    VALUES("Engineering"),
         ("Finance"),
         ("Legal"),
         ("Sales"),
         ("Server");

INSERT INTO role (title, salary, department_id)
    VALUES("Sales Lead", 100000, 4),
         ("Sales", 80000, 4),
         ("Engineer Lead", 150000, 1),
         ("Software Engineer", 120000, 1),
         ("Account Manager", 160000, 2),
         ("Accountant", 125000, 2),
         ("Legal Team lead", 250000, 3),
         ("Layer", 190000, 3);
        
INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES("John", "Doe", 1, Null),
         ("Mike", "Chan", 2, 1),
         ("Ashley", "Rodrihuez", 3, Null),
         ("Kevin", "Tupik", 4, 3),
         ("kunal", "Singh", 5, Null),
         ("Malia", "Brown", 6, 5),
         ("Sarah", "Lourd", 7,Null);

--SELECT * FROM departments;
--SELECT * FROM roles; 
--SELECT * FROM employee;