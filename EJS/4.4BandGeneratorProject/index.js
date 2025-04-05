import express from "express";
import bodyParser from "body-parser";
import { join } from "node:path";
import bandname from "bandname";
// import { listWords } from "./adj.js";

const staticFolder = {
  views: join(process.cwd(), "views"),
  public: join(process.cwd(), "public"),
};
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", staticFolder.views);
app.use(express.static(staticFolder.public));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    bandGenerator: "Welcome to the Band Generator 🤟",
    year: new Date().getFullYear(),
  });
});

app.post("/submit", (req, res) => {
  /* 
    📝 Explanation:
    
    There are multiple ways to handle this:

    🔹 Complex way:
      - Use `listWords(req, res);` from `adj.js` (requires extra processing).
      - Modify `index.ejs` with an `<% if (bandGenerator) %>` condition.
      - However, handling state between "/" and "/submit" can be tricky.

    ✅ Simpler way (Best approach):
      - On "/", `bandGenerator` is set to `"Welcome to the Band Generator 🤟"`.
      - On form submission ("/submit"):
        1️⃣ Generate a new band name with `bandname()`.
        2️⃣ Pass the new value via `res.render("index", { bandGenerator })`.
        3️⃣ The page updates with the new name.

    🎯 Why this method?
      - Ensures the page always gets fresh data.
      - No need for unnecessary `if (bandGenerator)` checks in EJS.
  */

  const randomBandName = bandname();
  res.render("index", {
    bandGenerator: randomBandName,
    year: new Date().getFullYear(),
  });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
