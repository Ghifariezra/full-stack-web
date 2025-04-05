import express from "express";
import ejs from "ejs";
import { join } from "node:path";

/**
 * Returns an object with two properties: dayType and advice.
 *
 * The dayType property will be either "Weekday" or "Weekend".
 * The advice property will be either "Get to work" or "Have a rest".
 *
 * @returns {Object} An object with two properties: dayType and advice.
 */
function AdviceForDay() {
  const dayIndex = new Date().getDay();

  // 0 = Sunday, 6 = Saturday
  switch (dayIndex) {
    case 0:
    case 6:
      // It's the weekend, take it easy
      return { dayType: "Weekend", advice: "Have a rest" };
    default:
      // It's a weekday, get to work
      return { dayType: "Weekday", advice: "Get to work" };
  }
}

const currentDir = process.cwd();
const app = express();
const port = 3000;
const pathEJS = join(currentDir, "views");

app.set("view engine", "ejs");
app.set("views", pathEJS);

app.get("/", (req, res) => {
  res.render("index", AdviceForDay());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
