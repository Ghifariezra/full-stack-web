-- Active: 1743635926160@@localhost@5432@world

-- Create a database called "world"
CREATE DATABASE world;
-- Create a table called "flags"
CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    flag TEXT
)
-- Create a table called "capitals"
CREATE TABLE capitals (
    id SERIAL PRIMARY KEY,
    country VARCHAR(50),
    capital VARCHAR(50)
)
-- Create a table called "food"
CREATE TABLE food (
    id SERIAL PRIMARY KEY,
    country VARCHAR(50),
    rice DOUBLE PRECISION,
    wheat DOUBLE PRECISION
);
-- Impor data from a CSV file
COPY food (country, rice, wheat)
FROM 'D:\Fullstack Web\PostgreSQL\8.2.1 Postgres Select-Where & Like\data\world-food.csv'  -- Ganti dengan path file CSV Anda
DELIMITER ','
CSV HEADER;
-- Check the data
SELECT * FROM food;
-- Create a table called "countries"
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL UNIQUE,
    country_name VARCHAR(50)
);
-- Impor data from a CSV file
COPY countries (id, country_code, country_name)
FROM 'D:\Fullstack Web\PostgreSQL\8.3 Travel Tracker\data\countries.csv'  -- Ganti dengan path file CSV Anda
DELIMITER ','
CSV HEADER;
-- Check the data
SELECT * FROM countries;
-- Create a table called "visited_countries"
CREATE TABLE visited_countries (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL UNIQUE
);
-- Check the data
SELECT * FROM visited_countries;
-- Drop Columns from the "visited_countries" table
ALTER TABLE visited_countries
DROP COLUMN country_name;
-- Remove all data & reset the sequence in the "visited_countries" table
TRUNCATE TABLE visited_countries RESTART IDENTITY;