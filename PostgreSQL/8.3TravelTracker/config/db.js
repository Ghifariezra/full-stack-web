import pg from "pg";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

class PostgresConnetion {
  #POSTGERS_USER = process.env.POSTGRES_USER;
  #POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
  #POSTGRES_PORT = process.env.POSTGRES_PORT;
  #POSTGRES_DB = process.env.POSTGRES_DB;
  #queryMaster = {
    countries: "SELECT * FROM countries",
    visited_countries: "SELECT * FROM visited_countries",
    users: "SELECT * FROM users",
  };
  #queryStatement = {
    users: `INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;`,
    visited_countries: `INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2) RETURNING *;`,
    visited_countriesJoinUsers: `SELECT * FROM visited_countries
    JOIN users ON users.id = user_id;`,
  }
  static instance;

  /**
   * Creates a new PostgresConnetion instance. If an instance already exists,
   * it returns the existing instance instead of creating a new one.
   * @returns {PostgresConnetion} The PostgresConnetion instance.
   */
  constructor() {
    if (PostgresConnetion.instance) {
      return PostgresConnetion.instance;
    }

    // Config Connection
    this.config = {
      user: this.#POSTGERS_USER,
      password: `${this.#POSTGRES_PASSWORD}#`,
      host: "localhost",
      port: this.#POSTGRES_PORT,
      database: this.#POSTGRES_DB,
    };

    // Initialize Pool & Events
    this.Pool = new pg.Pool(this.config);
    this.Pool.on("connect", () => {
      console.info("connected to the database");
    });
    this.Pool.on("error", (err) => {
      console.error("error connecting to the database", err);
    });
    this.Pool.on("remove", () => {
      console.info("client removed");
    });

    PostgresConnetion.instance = this;
  }
  /**
   * Fetches all countries from the database.
   * @returns {Promise<Array<Object>>} Promise that resolves to an array of country objects or rejects with an error.
   */
  async PoolFetchCountries() {
    this.clientCountries = await this.Pool.connect();
    try {
      const { rows: countries } = await this.clientCountries.query(this.#queryMaster.countries);
      return countries;
    } catch (error) {
      console.error("Error fetching capitals:", error);
      throw error;
    } finally {
      this.clientCountries.release();
    }
  }
  /**
   * Inserts a new country into the visited_countries table.
   * @param {Array<String|Number>} addCountryCode - An array containing the country code and the user ID.
   * @returns {Promise<void>} Promise that resolves when the query is complete or rejects with an error.
   */
  async PoolPushVisited(addCountryCode) {
    this.clientVisited = await this.Pool.connect();
    try {
      await this.clientVisited.query(this.#queryStatement.visited_countries, addCountryCode);
    } catch (error) {
      console.error("Error inserting visited country:", error);
      throw error;
    } finally {
      this.clientVisited.release();
    }
  }
  
  /**
   * Fetches all visited countries from the database.
   * @returns {Promise<Array<Object>>} Promise that resolves to an array of visited country objects or rejects with an error.
   */
  async PoolFetchVisited() {
    this.clientVisited = await this.Pool.connect();
    try {
      const { rows: visited } = await this.clientVisited.query(this.#queryMaster.visited_countries);
      return visited;
    } catch (error) {
      console.error("Error fetching visited countries:", error);
      throw error;
    } finally {
      this.clientVisited.release();
    }
  }

  /**
   * Fetches all users from the database.
   * @returns {Promise<Array<Object>>} Promise that resolves to an array of user objects or rejects with an error.
   */
  async PoolFetchUsers() {
    this.clientVisited = await this.Pool.connect();
    try {
      const { rows: users } = await this.clientVisited.query(this.#queryMaster.users);
      return users;
    } catch (error) {
      console.error("Error fetching visited countries:", error);
      throw error;
    } finally {
      this.clientVisited.release();
    }
  }

  /**
   * Inserts a new user into the users table.
   * @param {Array<Object>} newUser - Array containing the user's name and color.
   * @returns {Promise<null>} Promise that resolves when the user is inserted or rejects with an error.
   */
  async PoolPushUsers(newUser) {
    this.clientVisited = await this.Pool.connect();
    try {
      await this.clientVisited.query(this.#queryStatement.users, newUser);
    } catch (error) {
      console.error("Error inserting visited country:", error);
      throw error;
    } finally {
      this.clientVisited.release();
    }
  }
  
  /**
   * Fetches all join data from the database.
   * @returns {Promise<Array<Object>>} Promise that resolves to an array of join data objects or rejects with an error.
   */
  async PoolFetchJoin() {
    this.clientVisited = await this.Pool.connect();
    try {
      const { rows: join } = await this.clientVisited.query(this.#queryStatement.visited_countriesJoinUsers);
      return join;
    } catch (error) {
      console.error("Error fetching visited countries:", error);
      throw error;
    } finally {
      this.clientVisited.release();
    }
  }
}

export default PostgresConnetion;
