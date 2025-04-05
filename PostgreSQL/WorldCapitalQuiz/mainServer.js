import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const urlApi = "http://localhost:4000/api/quiz";
const app = express();
const port = 3000;

let totalCorrect = 0;
let currentQuestion = {}; // Inisialisasi currentQuestion di luar fungsi

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getQuiz() {
  return axios
    .get(urlApi)
    .then((response) => {
      const randomCountry = response.data.data[Math.floor(Math.random() * response.data.data.length)];
      return randomCountry; // Mengembalikan data dari API
    })
    .catch((error) => {
      console.error("Error fetching quiz:", error);
      return null; // Mengembalikan nilai null jika terjadi kesalahan
    });
}

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  currentQuestion = await getQuiz();
  console.log(currentQuestion);
  if (currentQuestion) {
    res.render("index.ejs", { question: currentQuestion });
  } else {
    res.status(500).send("Error fetching quiz data.");
  }
});

// POST a new post
app.post("/submit", async (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion && currentQuestion.capital && currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  currentQuestion = await getQuiz();
  if (currentQuestion) {
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect,
    });
  } else {
    res.status(500).send("Error fetching quiz data.");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});