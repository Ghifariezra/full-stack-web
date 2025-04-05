import express from "express";
import PostgresConnetion from "../config/db.js";

const apiRoutes = express.Router();
const conn = new PostgresConnetion();

/**
 * GET /api/countries
 * Get all countries from the database
 */
apiRoutes.get("/countries", async (req, res) => {
  try {
    const countries = await conn.PoolFetchCountries();
    res.status(200).json({
      message: "Countries fetched successfully",
      travelTracker: countries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries", error });
  }
});

/**
 * GET /api/visits
 * Get all visited countries from the database
 */
apiRoutes.get("/visits", async (req, res) => {
  try {
    const visitedCountries = await conn.PoolFetchVisited();
    res.status(200).json({
      message: "Visited countries fetched successfully",
      travelTracker: visitedCountries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visited countries", error });
  }
});

/**
 * GET /api/users
 * Get all users from the database
 */
apiRoutes.get("/users", async (req, res) => {
  try {
    const users = await conn.PoolFetchUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      travelTracker: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

/**
 * GET /api/joins
 * Get all joins from the database
 */
apiRoutes.get("/joins", async (req, res) => {
  try {
    const joins = await conn.PoolFetchJoin();
    res.status(200).json({
      message: "Joins fetched successfully",
      travelTracker: joins,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

export default apiRoutes;
