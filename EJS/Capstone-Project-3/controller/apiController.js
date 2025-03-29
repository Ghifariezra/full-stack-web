import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const userData = "../config/storage/data-users.json";
const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, userData);

let dataUsers = { users: [] }; // Default jika terjadi error

try {
  dataUsers = JSON.parse(readFileSync(dataPath, "utf8"));
  console.log("Data loaded successfully!");
} catch (error) {
  console.error("Error reading data file:", error);
}

const apiUsers = (req, res) => {
  res.json(dataUsers);
}
export { apiUsers };