import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

class PostgresConnection {
  #POSTGRES_USER = process.env.POSTGRES_USER;
  #POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
  #POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT);
  #POSTGRES_DB = process.env.POSTGRES_DB;
  #queryMaster = {
    items: "SELECT * FROM items",
  };
  #queryStatement = {
    insert: `INSERT INTO items (title) VALUES ($1) RETURNING *;`,
    update: `UPDATE items SET title = $1 WHERE id = $2 RETURNING *;`,
    delete: `DELETE FROM items WHERE id = $1 RETURNING *;`,
    refreshPK: `
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_id
    FROM items
  )
  UPDATE items
  SET item_id = ranked.new_id
  FROM ranked
  WHERE items.id = ranked.id;
`,
  };
  #config = {
    user: this.#POSTGRES_USER,
    password: `${this.#POSTGRES_PASSWORD}#`,
    host: "localhost",
    port: this.#POSTGRES_PORT,
    database: this.#POSTGRES_DB,
    max: 6,
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
  async fetchItems() {
    const client = await this.Pool.connect();
    try {
      const { rows: items } = await client.query(this.#queryMaster.items);
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async insertItem(title) {
    const client = await this.Pool.connect();
    try {
      const { rows: items } = await client.query(this.#queryStatement.insert, [title]);
      console.info("Successfully inserted item:", items);
      return items;
    } catch (error) {
      console.error("Error inserting item:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async updateItem(title, id) {
    const client = await this.Pool.connect();
    try {
      const { rows: items } = await client.query(this.#queryStatement.update, [title, id]);
      console.info("Successfully updated item:", items);
      return items;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async deleteItem(id) {
    const client = await this.Pool.connect();
    try {
      const { rows: items } = await client.query(this.#queryStatement.delete, [id]);
      console.info("Successfully deleted item:", items);
      return items;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    } finally {
      client.release();
    }
  }
  async refreshPK() {
    const client = await this.Pool.connect();
    try {
      const { rows: items } = await client.query(this.#queryStatement.refreshPK);
      console.info("Successfully refreshed PK:");
    } catch (error) {
      console.error("Error refreshing PK:", error);
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
