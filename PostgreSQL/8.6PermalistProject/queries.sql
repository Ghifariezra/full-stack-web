-- Active: 1743635926160@@localhost@5432@world

DROP TABLE IF EXISTS items;

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  item_id INT,
  title VARCHAR(100) NOT NULL
);

INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');
SELECT * FROM items;