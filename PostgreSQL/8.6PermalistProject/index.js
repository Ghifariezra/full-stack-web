import express from "express";
import bodyParser from "body-parser";
import { mainPage, addData, updateData, deleteData } from "./controllers/permalistController.js";
import db from "./config/db.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", mainPage);
app.post("/add", addData);
app.post("/edit", updateData);
app.post("/delete", deleteData);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
  await db.closeConnection();
});
