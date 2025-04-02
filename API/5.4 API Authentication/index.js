import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "Owrelly";
const yourPassword = "Pokeman123";
const yourAPIKey = "8f0dadeb-e7b7-4538-a30f-307306826ca4";
const yourBearerToken = "07cdceaf-7987-4358-8861-3bd2254cff98";
const instace = axios.create({
  baseURL: API_URL,
});

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    const response = await instace.get("/random");
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    res.render("index.ejs", { content: error });
  }
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
  const basicAuth = {
    username: yourUsername,
    password: yourPassword,
  };
  const params = {
    page: "2",
  };
  try {
    const response = await instace.get("/all", {
      params: params,
      auth: basicAuth,
    });
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    res.render("index.ejs", { content: error });
  }
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  const params = {
    apiKey: yourAPIKey,
    score: "5",
  };
  try {
    const response = await instace.get("/filter", {
      params: params,
    });
    res.render("index.ejs", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.render("index.ejs", { content: error });
  }
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  const headers = {
    Authorization: `Bearer ${yourBearerToken}`,
  };
  try {
    const response = await instace.get("/secrets/42", {
      headers: headers,
    });
    res.render("index.ejs", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.render("index.ejs", { content: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
