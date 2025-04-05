import PostgresConnetion from "../config/db.js";
import { fetchCountries, fetchVisited, fetchUsers, fetchJoins } from "../services/countryService.js";

const conn = new PostgresConnetion();
let currentId = 0;
let total = 0;

/**
 * Handles the homepage route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @description
 * This function renders the homepage of the travel tracker application.
 * It fetches the countries and users data, filters the countries data based on the sample
 * array, and then renders the homepage with the filtered data and total number of countries.
 */
const getHome = async (req, res) => {
  let bufferHome = [];
  const sampel = ["FR", "US", "GB"];
  const dataUsers = (await fetchUsers()).travelTracker;
  const dataCountries = (await fetchCountries()).travelTracker;

  // Filter the data and add it to the buffer
  const countries = dataCountries.filter((item) => sampel.includes(item.country_code));
  countries.forEach((item) => {
    bufferHome.push(item.country_code);
  });
  total = sampel.length;

  res.render("index.ejs", {
    countries: bufferHome,
    total: total,
    users: dataUsers,
    color: "teal",
  });
};

/**
 * Handles adding a country to the user's visited list.
 * 
 * @param {Object} req - Express request object containing the country name in the body.
 * @param {Object} res - Express response object for rendering the response.
 * 
 * @description
 * This function retrieves country and user data, validates if the country has been visited,
 * and adds it to the visited list if not. It checks if the country exists in the database,
 * if it's already visited by the current user, and handles errors during the process. 
 * Renders the homepage with updated visited countries or error messages.
 */
const addCountry = async (req, res) => {
  let addCountryCode = []

  const country = req.body.country.charAt(0).toUpperCase() + req.body.country.slice(1);
  const dataUsers = (await fetchUsers()).travelTracker;
  const joinData = (await fetchJoins()).travelTracker;
  const dataCountriesCountries = (await fetchCountries()).travelTracker || [];
  const dataCountriesVisited = (await fetchVisited()).travelTracker || [];  
  const mainData = joinData.filter((item) => item.id === currentId);

  // Find country based on name
  const amountVisited = mainData.map((item) => item.country_code);
  const matching = dataCountriesCountries.find((item) => item.country_name === country);
  const checkCountry = dataCountriesCountries.some((item) => item.country_name === country);
  const validateID = dataCountriesVisited.some((item) => item.user_id === currentId);
  
  // Validation: Country already visited when searching by name
  if (amountVisited.includes(matching.country_code) && validateID) {
    return res.render("index.ejs", {
      users: dataUsers,
      countries: amountVisited,
      total: amountVisited.length,
      color: mainData[0].color,
      error: "Country already visited",
    });
  }
  
  // Validation: Country not found when searching by name
  if (!checkCountry) {
    return res.render("index.ejs", {
      users: dataUsers,
      countries: amountVisited,
      total: amountVisited.length,
      color: mainData[0].color,
      error: "Country not found",
    });
  }

  // Save the country code to the database & add it to the buffer
  try {
    // Push the country code to the buffer
    amountVisited.push(matching.country_code);
    addCountryCode.push(matching.country_code, currentId);

    await conn.PoolPushVisited(addCountryCode);
    res.render("index.ejs", {
      users: dataUsers,
      countries: amountVisited,
      total: amountVisited.length,
      color: mainData[0].color,
    })
  } catch (error) {
    // console.error("Error saving country:", error);
    
    // Refresh Data
    const dataUsers = (await fetchUsers()).travelTracker;
    const joinData = (await fetchJoins()).travelTracker;
    const mainData = joinData.filter((item) => item.id === currentId);
    const amountVisited = mainData.map((item) => item.country_code);
    res.render("index.ejs", {
      users: dataUsers,
      countries: amountVisited,
      total: amountVisited.length,
      color: mainData[0].color,
      error: "Error saving country",
    })
  }
};

/**
 * Handles the POST request to /user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @description
 * Handles the POST request to /user. If the user clicks on the "New" button, it renders the new.ejs template.
 * Otherwise, it renders the homepage with the current user's visited countries and total amount of visited countries.
 */
const currentUser = async (req, res) => {
  try {
    const newPage = req.body.add;
    if (newPage === "new") {
      res.render("new.ejs")
      return;
    }

    currentId = parseInt(req.body.user);
    console.log("currentId", currentId);
    const dataUsers = (await fetchUsers()).travelTracker;
    const joinData = (await fetchJoins()).travelTracker;
    const mainData = joinData.filter((item) => item.id === currentId);
    const visitedCountries = mainData.map((item) => item.country_code);

    res.render("index.ejs", {
      countries: visitedCountries,
      total: visitedCountries.length,
      users: dataUsers,
      color: mainData[0].color,
    });
  } catch (error) {
    const dataUsers = (await fetchUsers()).travelTracker;
    res.render("index.ejs", {
      countries: [],
      total: 0,
      users: dataUsers,
      color: "teal",
    });
  }
};

/**
 * Adds a new user to the database.
 *
 * @param {Object} req - Express request object containing user data in the body.
 * @param {Object} res - Express response object for redirecting after user is added.
 *
 * @description
 * This function extracts user data from the request body, inserts the new user into the database, and redirects to the homepage.
 */
const addUser = async (req, res) => {
  const newUser = Object.values(req.body);
  await conn.PoolPushUsers(newUser);
  res.redirect("/");
};

export { getHome, addCountry, currentUser, addUser };
