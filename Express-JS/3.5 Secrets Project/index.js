import express from "express";
import bodyParser from "body-parser";
import { join } from "node:path";

const currentDir = process.cwd();
const app = express();
const port = 3000;

/**
 * Logs a message to the console when a request is received, including the
 * request method, URL, status code, and the time the request was received.
 */
function logRequest(req, res, next) {
  // Capture the current date and time as a formatted string
  const requestTime = new Date().toLocaleString();

  // Listen for the response to finish processing
  res.on("finish", () => {
    // Destructure method and url from the request object
    const { method, url } = req;
    // Destructure statusCode from the response object
    const { statusCode } = res;

    // Construct the log message
    const message = `${method} ${url} ${statusCode} | ${requestTime}`;
    // Output the log message to the console
    console.log(message);
  });

  // Proceed to the next middleware function
  next();
}

/**
 * Middleware to check the provided password in the request body.
 * If the password is correct, sends the 'secret.html' file and sets status to 200.
 * If the password is incorrect, sends the 'index.html' file and sets status to 401.
 */
function checkPasswordMiddleware(req, res, next) {
  // Define the correct password to compare with
  const correctPassword = "StillSecret";

  // Extract the password from the request body
  const { password } = req.body;

  // Check if the provided password matches the correct password
  if (password === correctPassword) {
    // Send the secret page if the password is correct
    res.sendFile(join(currentDir, "public", "secret.html"));
    res.status(200);
  } else {
    // Send the index page if the password is incorrect
    res.sendFile(join(currentDir, "public", "index.html"));
    res.status(401);
  }

  // Proceed to the next middleware function
  next();
}

app.use(logRequest, bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(currentDir, "public", "index.html"));
});

app.post("/check", checkPasswordMiddleware, (req, res) => {});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
