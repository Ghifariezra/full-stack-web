import express from "express";
import { addCountry, getHome, currentUser, addUser } from "../controllers/countryController.js";

const countryRoutes = express.Router();
countryRoutes.get("/", getHome);
countryRoutes.post("/add", addCountry);
countryRoutes.post("/user", currentUser);
countryRoutes.post("/new", addUser);
export default countryRoutes;
