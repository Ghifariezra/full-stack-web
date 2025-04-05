// Import built-in Node.js modules for working with the file system and paths
const fs = require("fs");
const path = require("path");

// Define the full path for the file to be created or read
const filePath = path.join(__dirname, "data", "message.txt");

// Write to the file using append mode ("a"), so it does not overwrite existing content
fs.writeFile(filePath, "Hello World!\n", { flag: "a" }, (err) => {
  // Handle errors if any occur while writing to the file
  if (err) throw err;

  console.log("The file has been saved at:", filePath);
});

// Read the file content with "utf8" encoding to ensure text output
fs.readFile(filePath, "utf8", (err, data) => {
  // Handle errors if any occur while reading the file
  if (err) throw err;

  // Display the file content in the console
  console.log("File content:\n", data);
});
