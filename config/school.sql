-- Active: 1746963501843@@127.0.0.1@3306@schools

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    contact VARCHAR(15) UNIQUE,
    image VARCHAR(150),
    email VARCHAR(150) UNIQUE
);


