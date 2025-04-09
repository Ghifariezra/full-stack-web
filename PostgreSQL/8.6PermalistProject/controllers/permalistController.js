import db from "../config/db.js";

const mainPage = async (req, res) => {
  await db.refreshPK();
  const items = await db.fetchItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
};
const addData = async (req, res) => {
  const { newItem } = req.body;
  if (!newItem || newItem.trim() === "") {
    res.redirect("/");
  }
  await db.insertItem(newItem);
  res.redirect("/");
};
const updateData = async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  if (!updatedItemTitle || updatedItemTitle.trim() === "") {
    res.redirect("/");
  }
  await db.updateItem(updatedItemTitle, updatedItemId);
  res.redirect("/");
};
const deleteData = async (req, res) => {
  const { deleteItemId } = req.body;
  await db.deleteItem(deleteItemId);
  res.redirect("/");
};

export { mainPage, addData, updateData, deleteData };
