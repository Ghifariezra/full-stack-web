import axios from "axios";
const urlApi = "http://localhost:3000/api";
const tracker = axios.create({
  baseURL: urlApi,
});

/**
 * Fetch countries from the API.
 * @returns {Promise<null|array>} Promise that resolves to an array of countries or null
 * if there is an error fetching the countries.
 */
async function fetchCountries() {
  return tracker
    .get("/countries")
    .then((response) => {
      const countries = response.data;
      return countries;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error.message);
      return null;
    });
}

/**
 * Fetch visited countries from the API.
 * @returns {Promise<null|array>} Promise that resolves to an array of visited countries or null
 * if there is an error fetching the data.
 */

async function fetchVisited() {
  return tracker
    .get("/visits")
    .then((response) => {
      const countries = response.data;
      return countries;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error.message);
      return null;
    });
}
/**
 * Fetch users from the API.
 * @returns {Promise<null|array>} Promise that resolves to an array of users or null
 * if there is an error fetching the data.
 */

async function fetchUsers() {
  return tracker
    .get("/users")
    .then((response) => {
      const countries = response.data;
      return countries;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error.message);
      return null;
    });
}
/**
 * Fetch join data from the API.
 * @returns {Promise<null|array>} Promise that resolves to an array of join data or null
 * if there is an error fetching the data.
 */

async function fetchJoins() {
  return tracker
    .get("/joins")
    .then((response) => {
      const countries = response.data;
      return countries;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error.message);
      return null;
    });
}

export { fetchCountries, fetchVisited, fetchUsers, fetchJoins };