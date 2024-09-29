-- Active: 1725139723792@@127.0.0.1@5432@softjobs
CREATE DATABASE softjobs;
-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    rol VARCHAR(25),
    lenguage VARCHAR(20)
);

INSERT INTO usuarios (email, password, rol, lenguage)
VALUES ('juan@example.com', 'passwordsegura', 'admin', 'Python');
-- Verificar la creación de la tabla con un SELECT
SELECT * FROM usuarios;