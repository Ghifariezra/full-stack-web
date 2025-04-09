-- Active: 1743635926160@@localhost@5432@library
-- SELECT id_author FROM authors;

DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    note_id INT NULL,
    note TEXT
)

INSERT INTO notes (note) 
VALUES 
('I realized how small, unconscious habits in the workplace can seriously damage my professional growth — like being late, gossiping, or resisting change.'),
('“You don’t get fired for being incompetent. You get fired for being annoying.” Made me laugh, but also made me think about how I show up in a team. “The easiest way to be valuable is to be easy to work with.” Simple but powerful. Soft skills matter—a lot.'),
('I used to think that success was all about being the most skilled. But this book reframed it: Success is about being consistent, proactive, and positive. That’s what makes someone irreplaceable.');


SELECT * FROM books;
SELECT * FROM book_info;
SELECT
    ROW_NUMBER() OVER (ORDER BY rating) AS new_id,
    isbn_13,
    image,
    title,
    description,
    full_name,
    publish_date,
    round(rating::numeric, 2) as rating
FROM books
    JOIN book_info as bi ON books.id_book = bi.book_id
WHERE
    description IS NOT NULL
ORDER BY rating DESC;

SELECT
    ROW_NUMBER() OVER (ORDER BY bi.id) AS new_id,
    image,
    title,
    description,
    full_name,
    publish_date,
    round(rating::numeric, 2) as rating
FROM books
    JOIN book_info as bi ON books.id_book = bi.book_id
WHERE
    lower(full_name) OR lower(title) LIKE 's' || '%'
ORDER BY bi.id ASC;