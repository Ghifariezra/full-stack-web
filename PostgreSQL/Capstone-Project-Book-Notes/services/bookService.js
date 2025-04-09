import axios from "axios";

const urlApi = "/api/collection";

const bookService = axios.create({
  baseURL: "http://localhost:3000",
});
const books = async () => {
  return bookService.get(urlApi)
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export { books };