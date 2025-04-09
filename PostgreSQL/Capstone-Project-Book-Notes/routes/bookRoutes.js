import express from "express";
import { home, orderBooks, search, detailPage, myNotes } from "../controllers/bookController.js";
import { bookCollection } from "../controllers/apiController.js";

const routes = express.Router();

// API Routes
routes.get("/api/collection", bookCollection);

// Book Routes
routes.get("/", home);
routes.get("/books/:isbn", detailPage);
routes.get("/books", orderBooks);
routes.post("/books/:isbn", myNotes);
routes.post("/search", search);

export default routes;