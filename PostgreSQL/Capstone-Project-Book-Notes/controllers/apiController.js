import db from "../config/dbConnection.js";

const bookCollection = async (req, res) => {
    try {
        const books = await db.fetchJoinMaster();
        console.log(books);
        res.send({
            message: "Books fetched successfully",
            bookCollection: books
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { bookCollection };