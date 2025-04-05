-- Active: 1743635926160@@localhost@5432@world

-- SQL Exercises: Select & Where & Like
SELECT * FROM food;
SELECT country FROM food;
SELECT country, wheat FROM food;
SELECT rice FROM food
WHERE country = 'United States';
SELECT country FROM food
WHERE wheat > 20;
SELECT country FROM food
WHERE country LIKE '%a';
