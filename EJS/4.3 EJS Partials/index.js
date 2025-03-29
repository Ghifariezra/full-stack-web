/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import { join } from "node:path";

const app = express();
const port = 3000;
const staticFolder = {
  views: join(process.cwd(), "views"),
  public: join(process.cwd(), "public"),
};

app.set("view engine", "ejs");
app.set("views", staticFolder.views);
app.use(express.static(staticFolder.public));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
