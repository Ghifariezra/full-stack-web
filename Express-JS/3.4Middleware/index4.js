import express from "express";
import { join } from "node:path";
import bodyParser from "body-parser";

const currentDir = process.cwd();
const app = express();
const port = 3000;

function logger(req, res, next) {
  var date = new Date();
  let dateNow = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  res.on("finish", () => {
    let result = `${req.method} ${req.path} ${res.statusCode} | ${dateNow}`;
    console.log(result);
  });

  next();
}

function bandNameGenerator(req, res, next) {
  console.log(req.body);
  var greetingSubmit = "<h1>Your band name is: </h1>";
  var bandName = `<h2>${req.body.street} ${req.body.pet} 🤘</h2>`;
  req.body.bandName = greetingSubmit + bandName;
  next();
}

app.use(logger, bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(currentDir, "public", "index.html"));
});

app.post("/submit", bandNameGenerator, (req, res) => {
  // Do something with the form data
  res.send(req.body["bandName"]);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
