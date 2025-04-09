import axios from "axios";
import dotenv from "dotenv";
import db from "../config/dbConnection.js";

dotenv.config();

export default class BigBookAPI {
  static instance;

  /*
  Quota request: 1.0,
  Quota used: 34.0,
  Quota left: 16.0
  */
  #API_KEY = process.env.API_KEY;
  #ENDPOINT = "https://api.bigbookapi.com";
  // #timeout = 1000;

  #bookService = axios.create({
    baseURL: this.#ENDPOINT,
    // timeout: this.#timeout || 0,
  });

  #endpoints = {
    searchBooks: "/search-books",
  };

  constructor() {
    if (BigBookAPI.instance) return BigBookAPI.instance;

    this.#bookService.interceptors.response.use(
      (response) => {
        const quotaRequest = response.headers["x-api-quota-request"];
        const quotaUsed = response.headers["x-api-quota-used"];
        const quotaLeft = response.headers["x-api-quota-left"];
        console.log(`Quota request: ${quotaRequest}, Quota used: ${quotaUsed}, Quota left: ${quotaLeft}`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        if (status === 402) {
          console.error("Quota habis hari ini!");
        } else if (status === 429) {
          console.warn("Terlalu banyak request! Coba lagi sebentar...");
        }
        return Promise.reject(error);
      }
    );

    BigBookAPI.instance = this;
  }
  async searchBooks(queryParams = {}) {
    try {
      const response = await this.#bookService.get(this.#endpoints.searchBooks, {
        params: {
          ...queryParams,
          "api-key": this.#API_KEY,
        },
      });
      const rawsBooks = Array.isArray(response.data.books) ? response.data.books.flat() : [];

      if (!rawsBooks.length) {
        console.warn("Book not found.");
        return [];
      }

      await db.insertBooks(rawsBooks);
      await db.closeConnection();

      return true;
    } catch (error) {
      console.error("Error searching books:", error.message);
      return null;
    }
  }
  async infoBooks(queryParams = {}) {
    try {
      const response = await this.#bookService.get(`/${queryParams.id}`, {
        params: {
          "api-key": this.#API_KEY,
        },
      });
      console.log(response.data);

      const { authors: [{ id: authorId, name: authorName } = {}] = [{}], id: bookId, identifiers: { open_library_id, isbn_13 } = {}, publish_date, number_of_pages, description = null, rating: { average: ratingAverage = null } = {} } = response.data || {};

      console.log(`Author ID: ${authorId}, Author Name: ${authorName}, Book ID: ${bookId}, OL ID: ${open_library_id}, ISBN 13: ${isbn_13}, Publish Date: ${publish_date}, Pages: ${number_of_pages}, Description: ${description}, Rating: ${ratingAverage}`);

      await db.insertBookInfoID([
        authorName,
        authorId, // Pastikan authorId ada dan di posisi yang benar
        bookId,
        open_library_id,
        isbn_13,
        publish_date,
        number_of_pages,
        description,
        ratingAverage,
      ]);

      return [authorId, bookId, open_library_id, isbn_13, publish_date, number_of_pages, description, ratingAverage];
    } catch (error) {
      console.error("Error get info books:", error.message);
      return null;
    }
  }
}

const bookService = new BigBookAPI();

await bookService.searchBooks({
  number: 100,
  "sort-direction": "asc",
});
async function fetchAndPopulateBookInfo() {
  try {
    const bookIds = await db.fetchBookIDs();
    console.log("Daftar Book IDs:", bookIds);

    for (const bookId of bookIds.splice(41)) {
      console.log(`Mendapatkan informasi untuk Book ID: ${bookId}`);
      const bookInfo = await bookService.infoBooks({ id: bookId });

      if (bookInfo) {
        console.log(`Informasi berhasil didapatkan dan (mungkin) disimpan untuk Book ID: ${bookId}`);
      } else {
        console.warn(`Gagal mendapatkan informasi untuk Book ID: ${bookId}`);
      }
    }
    console.log("Proses mendapatkan informasi buku selesai.");
    await db.closeConnection(); // Tutup koneksi database setelah selesai
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    if (db.Pool) {
      await db.closeConnection(); // Pastikan koneksi ditutup jika terjadi error
    }
  }
}

// fetchAndPopulateBookInfo();
