// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import ejs from "ejs";

// 2. Create an express app and set the port number.
const EndPoint = "https://secrets-api.appbrewery.com"
const app = express();
const port = 3000;
const randomSecret = axios.create({
    baseURL: EndPoint
})

// 3. Use the public folder for static files.
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// 4. When the user goes to the home page it should render the index.ejs file.
app.get("/", async (req, res) => {
  // 5. Use axios to get a random secret and pass it to index.ejs to display the
  // secret and the username of the secret.
  randomSecret
    .get("/random")
    .then((response) => {
      const result = response.data;
      res.render("index.ejs", {
        secret: result.secret,
        user: result.username
      })
    }).catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    })
});

// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
