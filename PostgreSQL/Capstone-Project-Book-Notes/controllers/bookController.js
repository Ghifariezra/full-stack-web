import { books } from "../services/bookService.js";
import db from "../config/dbConnection.js";

let notes = [
  "I realized how small, unconscious habits in the workplace can seriously damage my professional growth — like being late, gossiping, or resisting change.",
  "“You don’t get fired for being incompetent. You get fired for being annoying.” Made me laugh, but also made me think about how I show up in a team. “The easiest way to be valuable is to be easy to work with.” Simple but powerful. Soft skills matter—a lot.",
  "I used to think that success was all about being the most skilled. But this book reframed it: Success is about being consistent, proactive, and positive. That’s what makes someone irreplaceable.",
];

const home = async (req, res) => {
  const result = await books();
  res.render("index.ejs", { bookCollection: result.bookCollection.master });
};
const orderBooks = async (req, res) => {
  const sortBy = req.query.sortBy || "master";
  const result = await books();
  const keys = Object.keys(result.bookCollection).splice(1);
  console.log(keys);

  if (keys.includes(sortBy)) {
    console.log(sortBy);
    res.render("index.ejs", { bookCollection: result.bookCollection[sortBy] });
  } else {
    res.render("index.ejs", { bookCollection: result.bookCollection[sortBy] });
  }
};
const search = async (req, res) => {
  const keyword = req.body.keyword;
  console.log(keyword);
  const result = await db.searchBook(keyword);

  // Important: Do not close the connection here, because it will be used again in another route (ex: home):
  // await db.closeConnection();

  console.log(result);
  res.render("index.ejs", { bookCollection: result, keyword: keyword });
};
const detailPage = async (req, res) => {
  const bookISBN = req.params.isbn;
  await db.refreshPK();
  notes = await db.fetchNotes();
  // console.log(notes);
  const result = await db.searchBook(bookISBN);
  res.render("./partials/section/detail-page.ejs", { bookCollection: result, notes: notes });
};
const myNotes = async (req, res) => {
  const bookISBN = req.params.isbn;
  const result = await db.searchBook(bookISBN);
  let { noteId, noteEdit, noteNew, action } = req.body;
  await db.refreshPK();
  notes = await db.fetchNotes();

  console.log(req.body);
  console.log(notes);

  if (action === "add") {
    await db.insertNote(noteNew);
    res.redirect(`/books/${bookISBN}`);
  } else if (action === "edit") {
    if (typeof noteId === "string") {
      noteId = parseInt(noteId);
      const noteContent = noteEdit?.[noteId - 1];
      if (noteContent !== undefined) {
        await db.updateNote(noteContent, noteId);
      }
      res.redirect(`/books/${bookISBN}`);
    } else if (Array.isArray(noteId)) {
      for (const id of noteId) {
        const parsedId = parseInt(id);
        const noteContent = noteEdit?.[parsedId - 1];
        if (noteContent !== undefined) {
          await db.updateNote(noteContent, parsedId);
        }
      }
      res.redirect(`/books/${bookISBN}`);
    } else {
      res.redirect(`/books/${bookISBN}`);
    }
  } else if (action === "delete") {
    if (typeof noteId === "string") {
      noteId = parseInt(noteId);
      await db.deleteNote(noteId);
    } else if (Array.isArray(noteId)) {
      for (const id of noteId) {
        const parsedId = parseInt(id);
        await db.deleteNote(parsedId);
      }
    }
    res.redirect(`/books/${bookISBN}`);
  }
};

export { home, orderBooks, search, detailPage, myNotes };
