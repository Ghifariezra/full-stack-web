import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
const blogApi = axios.create({
  baseURL: API_URL,
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  blogApi
    .get("/posts")
    .then((response) => {
      res.render("index.ejs", { posts: response.data.posts });
    }).catch((error) => {
      res.status(500).json({ message: "Error fetching posts" });
    })
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  blogApi
    .get(`/posts/${req.params.id}`)
    .then((response) => {
      res.render("modify.ejs", {
        heading: "Edit Post",
        submit: "Update Post",
        post: response.data.post,
      });
    }).catch((error) => {
      res.status(500).json({ message: "Error fetching post" });
    })
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  blogApi
    .post("/posts", req.body)
    .then((response) => {
      console.log(response.data.post);
      res.redirect("/");
    }).catch((error) => {
      res.status(500).json({ message: "Error creating post" });
    })
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  blogApi
    .patch(`/posts/${req.params.id}`, req.body)
    .then((response) => {
      console.log(response.data.post);
      res.redirect("/");
    }).catch((error) => {
      res.status(500).json({ message: "Error updating post" });
    })
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  blogApi
    .delete(`/posts/${req.params.id}`)
    .then((response) => {
      console.log(response.data.message);
      res.redirect("/");
    }).catch((error) => {
      res.status(500).json({ message: "Error deleting post" });
    })
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
