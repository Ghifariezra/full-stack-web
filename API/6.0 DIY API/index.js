import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { objJokes, getRandomJoke } from "./config/jokes.data.js";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random joke
app.get("/random/", async (req, res) => {
  const randomJoke = await getRandomJoke();
  if (randomJoke) {
    res.json({
      message: "Joke found successfully",
      joke: randomJoke,
    });
  } else {
    res.status(404).json({
      error: "No jokes found",
    });
  }
});
//2. GET a specific joke
app.get("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }
  const specificJoke = objJokes[id];
  if (!specificJoke) {
    return res.status(404).json({ error: "Joke not found" });
  }
  return res.json({
    message: "Joke found successfully",
    joke: specificJoke,
  });
});
//3. GET a jokes by filtering on the joke type
app.get("/jokes/", async (req, res) => {
  const type = req.query.type;
  if (!type) {
    return res.status(400).json({ error: "No type specified" });
  }
  const filteredJokes = Object.values(objJokes).filter((joke) => joke.jokeType === type);
  if (filteredJokes.length === 0) {
    return res.status(404).json({ error: "No jokes match the type" });
  }
  return res.json({
    message: "Jokes filtered successfully",
    jokes: filteredJokes,
  });
});
//4. POST a new joke
app.post("/jokes", async (req, res) => {
  const { text, type } = req.body;
  if (!text || !type) {
    return res.status(400).json({
      error: "No text or type specified",
    });
  }
  const newJoke = {
    id: Object.keys(objJokes).length + 1,
    jokeText: text,
    jokeType: type,
  };
  objJokes[newJoke.id] = newJoke;
  return res.status(201).json({
    message: "Joke added successfully",
    joke: newJoke,
  });
});
//5. PUT a joke
app.put("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }
  const { text, type } = req.body;
  if (!text || !type) {
    return res.status(400).json({ error: "No text or type specified" });
  }
  const joke = objJokes[id];
  if (!joke) {
    return res.status(404).json({ error: "Joke not found" });
  }
  objJokes[id] = {
    id: id,
    jokeText: text,
    jokeType: type,
  };
  return res.json({
    message: "Joke updated successfully",
    joke: objJokes[id],
  });
});
//6. PATCH a joke
app.patch("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }
  const { text, type } = req.body;
  const joke = objJokes[id];
  if (!joke) {
    return res.status(404).json({ error: "Joke not found" });
  }
  if (!text && !type) {
    return res.status(400).json({ error: "No text or type specified" });
  }
  objJokes[id] = {
    id: id,
    jokeText: text || joke.jokeText,
    jokeType: type || joke.jokeType,
  };
  return res.json({
    message: "Joke updated successfully",
    joke: objJokes[id],
  });
});
//7. DELETE Specific joke
app.delete("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }
  if (!objJokes[id]) {
    return res.status(404).json({ error: "Joke not found" });
  }

  delete objJokes[id];

  return res.json({
    message: "Joke deleted successfully",
    jokes: Object.values(objJokes),
  });
});

//8. DELETE All jokes
app.delete("/all", async (req, res) => {
  const apiKey = req.query.Apikey;
  if (apiKey !== masterKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const jokes = Object.values(objJokes);
  const deletedJokes = jokes.forEach((joke) => {
    delete objJokes[joke.id];
  })
  
  return res.json({
    message: "All jokes deleted successfully",
    jokes: deletedJokes,
  });
})

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
