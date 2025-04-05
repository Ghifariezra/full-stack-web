import express from "express";
import bodyParser from "body-parser";
import { join } from "node:path";

const currentDir = process.cwd();
const app = express();
const port = 3000;
const pathEJS = join(currentDir, "views");

app.set("view engine", "ejs");
app.set("views", pathEJS);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { message: "<h1>Enter your name below 👇</h1>" });
});

app.post("/submit", (req, res) => {
  let amountOfLetters = (req.body.fName.length + req.body.lName.length).toString();
  res.render("index", { message: `<h1>There are ${amountOfLetters} letters in your name.</h1>` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
