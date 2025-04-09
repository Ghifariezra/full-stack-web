-- Active: 1743635926160@@localhost@5432@library

create DATABASE library;

DROP TABLE IF EXISTS books, book_info;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    id_book INT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    image TEXT
);
-- Membuat tabel book_info
CREATE TABLE book_info (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    author_id INT NOT NULL, 
    book_id INT NOT NULL REFERENCES books(id_book),
    open_library_id VARCHAR(50) UNIQUE,
    isbn_13 BIGINT,
    publish_date SMALLINT,
    number_of_pages SMALLINT,
    description TEXT,
    rating DOUBLE PRECISION
);
