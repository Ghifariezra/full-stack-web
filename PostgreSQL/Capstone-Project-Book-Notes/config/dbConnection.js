import pg from "pg";
import format from "pg-format";
import dotenv from "dotenv";

dotenv.config();

class PostgresConnection {
  #POSTGRES_USER = process.env.POSTGRES_USER;
  #POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
  #POSTGRES_HOST = parseInt(process.env.POSTGRES_HOST);
  #POSTGRES_DB = process.env.POSTGRES_DB;
  #queryMaster = {
    books: "SELECT id_book FROM books",
    notes: "SELECT * FROM notes",
  };
  #queryStatement = {
    inserNote: "INSERT INTO notes (note) VALUES ($1) RETURNING *;",
    updateNote: "UPDATE notes SET note = $1 WHERE id = $2 RETURNING *;",
    deleteNote: "DELETE FROM notes WHERE id = $1 RETURNING *;",
    refreshPK: `
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_id
      FROM notes
    )
    UPDATE notes
    SET note_id = ranked.new_id
    FROM ranked
    WHERE notes.id = ranked.id;`,
    insertBooks: "INSERT INTO books (id_book, title, subtitle, image) VALUES %L",
    insertInfoBooks: "INSERT INTO book_info (full_name, author_id, book_id, open_library_id, isbn_13, publish_date, number_of_pages, description, rating) VALUES %L",
    joinMasterOrder: {
      master:
        "SELECT ROW_NUMBER() OVER () AS id, isbn_13, image, title, description, full_name, publish_date, round(rating::numeric, 2) as rating FROM books JOIN book_info as bi ON books.id_book = bi.book_id WHERE description IS NOT NULL;",
      title:
        "SELECT ROW_NUMBER() OVER (ORDER BY title) AS id, isbn_13, image, title, description, full_name, publish_date, round(rating::numeric, 2) as rating FROM books JOIN book_info as bi ON books.id_book = bi.book_id WHERE description IS NOT NULL ORDER BY title ASC;",
      publish_date:
        "SELECT ROW_NUMBER() OVER (ORDER BY publish_date) AS id, isbn_13, image, title, description, full_name, publish_date, round(rating::numeric, 2) as rating FROM books JOIN book_info as bi ON books.id_book = bi.book_id WHERE description IS NOT NULL ORDER BY publish_date DESC;",
      rating:
        "SELECT ROW_NUMBER() OVER (ORDER BY rating) AS id, isbn_13, image, title, description, full_name, publish_date, round(rating::numeric, 2) as rating FROM books JOIN book_info as bi ON books.id_book = bi.book_id WHERE description IS NOT NULL ORDER BY rating DESC;",
      search: `
        SELECT
        ROW_NUMBER() OVER (ORDER BY bi.id) AS id,
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
        (lower(full_name) LIKE lower($1) || '%' OR lower(title) LIKE lower($1) || '%' OR
        cast(isbn_13 as text) = $1 OR
        cast(bi.id as text) = $1) AND
        description IS NOT NULL
    ORDER BY bi.id ASC;
    `,
    },
  };
  #config = {
    connectionString: `postgresql://${this.#POSTGRES_USER}:${this.#POSTGRES_PASSWORD}@${this.#POSTGRES_HOST}/${this.#POSTGRES_DB}?sslmode=require`,
  };
  static instance;
  constructor() {
    if (PostgresConnection.instance) {
      return PostgresConnection.instance;
    }

    // Initialize Pool & Events
    this.Pool = new pg.Pool(this.#config);
    this.Pool.on("connect", () => {
      console.info("connected to the database");
    });
    this.Pool.on("error", (err) => {
      console.error("error connecting to the database", err);
    });
    this.Pool.on("remove", () => {
      console.info("client removed");
    });

    PostgresConnection.instance = this;
  }
  async deleteNote(id) {
    const client = await this.Pool.connect();
    try {
      await client.query(this.#queryStatement.deleteNote, [id]);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async updateNote(note, id) {
    const client = await this.Pool.connect();
    try {
      await client.query(this.#queryStatement.updateNote, [note, id]);
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async insertNote(note) {
    const client = await this.Pool.connect();
    try {
      await client.query(this.#queryStatement.inserNote, [note]);
    } catch (error) {
      console.error("Error inserting note:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async refreshPK() {
    const client = await this.Pool.connect();
    try {
      const { rows: notes } = await client.query(this.#queryStatement.refreshPK);
      console.info("Successfully refreshed PK:");
    } catch (error) {
      console.error("Error refreshing PK:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async fetchNotes() {
    const client = await this.Pool.connect();
    try {
      const { rows: notes } = await client.query(this.#queryMaster.notes);
      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async fetchJoinMaster() {
    const client = await this.Pool.connect();
    try {
      const { rows: master } = await client.query(this.#queryStatement.joinMasterOrder.master);
      const { rows: title } = await client.query(this.#queryStatement.joinMasterOrder.title);
      const { rows: publish_date } = await client.query(this.#queryStatement.joinMasterOrder.publish_date);
      const { rows: rating } = await client.query(this.#queryStatement.joinMasterOrder.rating);
      return {
        master: master,
        title: title,
        published: publish_date,
        rate: rating,
      };
    } catch (error) {
      console.error("Error fetching join master:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async fetchBookIDs() {
    const client = await this.Pool.connect();
    try {
      const { rows } = await client.query(this.#queryMaster.books);
      const bookIDs = rows.map((row) => row.id_book);
      return bookIDs;
    } catch (error) {
      console.error("Error fetching book IDs:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async insertBookInfoID(infoBooks) {
    const client = await this.Pool.connect();
    try {
      const query = format(this.#queryStatement.insertInfoBooks, [infoBooks]);
      console.log("Formatted Query:", query); // Lihat query yang dihasilkan pg-format
      await client.query(query);
      console.info("Successfully inserted book ID (using format):", infoBooks);
    } catch (error) {
      console.error("Error inserting book ID (using format):", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async insertBooks(books) {
    const client = await this.Pool.connect();
    try {
      const values = books.map((book) => [book.id, book.title, book.subtitle ?? null, book.image]);
      const query = format(this.#queryStatement.insertBooks, values);
      await client.query(query);
      console.info("Successfully inserted books:", books);
    } catch (error) {
      console.error("Error inserting books:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async searchBook(keyword) {
    const client = await this.Pool.connect();
    try {
      const { rows: author } = await client.query(this.#queryStatement.joinMasterOrder.search, [keyword.toLowerCase()]);
      return author;
    } catch (error) {
      console.error("Error finding author:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async closeConnection() {
    console.info("Closing database connection...");

    // Optional: Log info sebelum ditutup
    console.info("Total connections:", this.Pool.totalCount);
    console.info("Idle connections:", this.Pool.idleCount);
    console.info("Waiting requests:", this.Pool.waitingCount);

    await this.Pool.end();
    console.info("Pool connection closed.");
  }
}

const db = new PostgresConnection();
export default db;
