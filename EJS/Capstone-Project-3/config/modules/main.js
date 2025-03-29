import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";

class Validator {
  /**
   * Initializes a new instance of the Validator class.
   * Extracts and assigns user details from the request body.
   * Sets up the response and next middleware function.
   * Records the current date and time as an ISO string.
   * Loads user data from the data.json file, or initializes with default if an error occurs.
   *
   * @param {Object} req - The HTTP request object containing user details in the body.
   * @param {Object} res - The HTTP response object for sending responses.
   * @param {Function} next - The next middleware function in the stack.
   */

  constructor(req, res, next) {
    const { username, email, password, confirmPassword } = req.body;
    this.username = username;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.res = res; // Tambahkan res ke instance class
    this.next = next; // Tambahkan next untuk middleware
    this.dateISO = new Date().toISOString();

    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.dataPath = resolve(__dirname, "../storage/data.json");
    this.dataPathUsers = resolve(__dirname, "../storage/data-users.json");

    try {
      this.data = JSON.parse(readFileSync(this.dataPath, "utf8"));
      this.dataUsers = JSON.parse(readFileSync(this.dataPathUsers, "utf8"));
      console.log("Data loaded successfully!");
    } catch (error) {
      console.error("Error reading data file:", error);
      this.data = { users: [] }; // Default jika terjadi error
      this.dataUsers = { users: [] };
    }
  }

  /**
   * Checks if the provided username already exists in the database.
   * @returns {Boolean} True if the username does not exist, false if it does.
   */
  userValidation() {
    return !this.data.users.find((user) => user.username === this.username);
  }

  /**
   * Checks if the provided email already exists in the database.
   * @returns {Boolean} True if the email does not exist, false if it does.
   */
  emailValidation() {
    return !this.data.users.find((user) => user.email === this.email);
  }

  /**
   * Checks if the provided password matches the confirm password.
   * @returns {Boolean} True if the passwords match, false if they do not.
   */
  passwordValidation() {
    return this.password === this.confirmPassword;
  }

  /**
   * Checks if the provided username and password match an existing user in the database.
   * If the username is not found, sends a 401 response with an error message.
   * If the password is incorrect, sends a 401 response with an error message.
   * If the login is successful, sends a JSON response with a success message, the user's data, and the current date and time as an ISO string.
   * @returns {Boolean} True if the login is successful, false if it fails.
   */
  loginValidation() {
    const user = this.data.users.find((user) => user.username === this.username);

    if (!user) {
      console.log("Login failed: User not found");
      return { success: false, message: "User not found", type: "error" };
    }

    if (!bcrypt.compareSync(this.password, user.password)) {
      console.log("Login failed: Incorrect password");
      return { success: false, message: "Incorrect password", type: "error" };
    }

    console.log("Login successful");
    return { success: true, message: "Login successful!", type: "success", user };
  }

  /**
   * Validates the registration data by checking if the username or email already exists,
   * and if the passwords match. If validation fails, sends a JSON response with an error
   * message and a 400 status code. If validation passes, hashes the password, adds the
   * new user to the database, writes the updated data to the file, and sends a JSON response
   * with a success message. If there is an error writing to the file, sends a JSON response
   * with an error message and a 500 status code.
   * @returns {Boolean} True if registration is successful, false otherwise.
   */
  registerValidation() {
    let errorMessage = !this.userValidation() ? "Username already exists" : !this.emailValidation() ? "Email already exists" : !this.passwordValidation() ? "Passwords do not match" : null;

    if (errorMessage) {
      console.log(`Registration failed: ${errorMessage}`);
      return { success: false, message: errorMessage, type: "error" };
    }

    console.log("Registration successful");
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    console.log("Hashed password:", hashedPassword);

    this.data.users.push({
      username: this.username,
      email: this.email,
      password: hashedPassword,
      createdAt: this.dateISO,
    });

    this.dataUsers.users.push({
      username: this.username,
      email: this.email,
      createdAt: this.dateISO,
    });

    try {
      writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), "utf8");
      writeFileSync(this.dataPathUsers, JSON.stringify(this.dataUsers, null, 2), "utf8");
      console.log("User added successfully!");

      return { success: true, message: "Registration successful!", type: "success" };
    } catch (error) {
      console.error("Error writing data file:", error);
      return { success: false, message: "Internal Server Error", type: "error" };
    }
  }
}
class ArticleStorage {
  constructor() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.dataArticlesPath = resolve(__dirname, "../storage/data-articles.json");

    try {
      const fileData = readFileSync(this.dataArticlesPath, "utf8");
      this.articles = JSON.parse(fileData);
      if (!this.articles.uploads) {
        this.articles = { uploads: [] };
      }
      console.log("Article data loaded successfully!");
    } catch (error) {
      console.error("Error reading article data file:", error);
      this.articles = { uploads: [] };
    }
  }

  saveArticleFromRequest(req) {
    const { headline, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!headline || !description) {
      console.error("Invalid article submission: Headline and description required");
      return false; // Indikasi gagal
    }

    this.addArticle({ image: imagePath, headline, description });
    return true; // Indikasi sukses
  }

  saveArticles() {
    try {
      writeFileSync(this.dataArticlesPath, JSON.stringify(this.articles, null, 2), "utf8");
      console.log("Articles saved successfully!");
    } catch (error) {
      console.error("Error writing article data file:", error);
    }
  }

  addArticle(article) {
    if (!article.headline || !article.description) {
      console.error("Invalid article data: headline and description are required");
      return;
    }
    this.articles.uploads.unshift({
      image: article.image || null, // Pastikan nilai default jika gambar tidak diunggah
      headline: article.headline,
      description: article.description,
      createdAt: new Date().toISOString(),
    });

    this.saveArticles();
  }
  getArticles() {
    return this.articles.uploads;
  }
  deleteArticle(index) {
    if (index >= 0 && index < this.articles.uploads.length) {
      this.articles.uploads.splice(index, 1);
      this.saveArticles();
      console.log("Article deleted successfully!");
    } else {
      console.error("Invalid article index");
    }
  }
}

export { Validator, ArticleStorage };
