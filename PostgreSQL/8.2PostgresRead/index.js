import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function nextQuestion() {
  return axios
    .get("http://localhost:4000/api/quiz")
    .then((response) => {
      const randomCountry = response.data.data[Math.floor(Math.random() * response.data.data.length)];
      return randomCountry; // Mengembalikan data dari API
    })
    .catch((error) => {
      console.error("Error fetching quiz:", error);
    });
}

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  currentQuestion = await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", async (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  currentQuestion = await nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// function nextQuestion() {
//   const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
//   currentQuestion = randomCountry;
// }

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
