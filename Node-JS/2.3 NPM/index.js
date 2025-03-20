// =========================
// CommonJS (CJS) Modules
// =========================

// Import the "sillyname" package using CommonJS syntax
var generateName = require("sillyname");

// Generate a random silly name
var sillyName = generateName();

// Log the generated name to the console
console.log(`My name is ${sillyName}.`);

// =========================
// ECMAScript (ESM) Modules
// =========================

// Import the "randomSuperhero" function from the "superheroes" package using ES module syntax
import { randomSuperhero } from "superheroes";

// Generate a random superhero name
const name = randomSuperhero();

// Log the generated superhero name to the console
console.log(`I am ${name}!`);
