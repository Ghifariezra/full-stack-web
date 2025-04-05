import express from "express";
import quiz from "./config/db.js";

const app = express();
const port = 4000;

/**
 * Purpose of this code:
 * The reason for creating this code is to provide an API interface for accessing data.
 * Instead of directly importing the DB connection, which may result in lost connections after data extraction,
 * this API ensures data availability even if the database connection is interrupted.
 * By using this API, data can be accessed continuously without re-establishing the DB connection each time.
 */
app.get("/api/quiz", (req, res) => {
  res.send({
    message: "Quiz found successfully",
    data: quiz,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
