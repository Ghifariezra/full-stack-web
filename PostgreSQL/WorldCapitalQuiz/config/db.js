import pg from "pg";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

class PostgresConnetion {
  #POSTGERS_USER = process.env.POSTGRES_USER;
  #POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
  #POSTGRES_PORT = process.env.POSTGRES_PORT;
  #POSTGRES_DB = process.env.POSTGRES_DB;
  #query = {
    capitals: "SELECT * FROM capitals",
    flags: "SELECT * FROM flags",
  };
  static instance;

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
  async getAll() {
    this.client = await this.Pool.connect();
    try {
      const { rows: capitals } = await this.client.query(this.#query.capitals);
      const { rows: flags } = await this.client.query(this.#query.flags);
      const mergeObj = _.merge(capitals, flags);
      return mergeObj;
    } catch (error) {
      console.error("Error fetching capitals:", error);
      throw error;
    } finally {
      this.client.release();
    }
  }
}

const conn = new PostgresConnetion();
const quiz = await conn.getAll();
export default quiz;