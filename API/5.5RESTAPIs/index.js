import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const yourBearerToken = "YOUR_BEARER_TOKEN";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

// Setup Instance & Configuration
const secretApiAppBrewery = axios.create({
  baseURL: API_URL,
  headers: config.headers,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  console.log(req.body);

  secretApiAppBrewery
    .get(`/secrets/${searchId}`)
    .then((response) => {
      res.render("index.ejs", {
        content: JSON.stringify(response.data),
      });
    })
    .catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    });
});

app.post("/post-secret", (req, res) => {
  secretApiAppBrewery
    .post("/secrets", req.body)
    .then((response) => {
      res.render("index.ejs", {
        content: JSON.stringify(response.data),
      });
    }).catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    })
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  secretApiAppBrewery
    .put(`/secrets/${searchId}`, req.body)
    .then((response) => {
      res.render("index.ejs", {
        content: JSON.stringify(response.data),
      });
    }).catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    })
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  secretApiAppBrewery
    .patch(`/secrets/${searchId}`, req.body)
    .then((response) => {
      res.render("index.ejs", {
        content: JSON.stringify(response.data),
      });
    }).catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    })
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  secretApiAppBrewery
    .delete(`/secrets/${searchId}`)
    .then((response) => {
      res.render("index.ejs", {
        content: JSON.stringify(response.data),
      });
    }).catch((error) => {
      res.render("index.ejs", {
        content: error.response.data.error,
      });
    })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
