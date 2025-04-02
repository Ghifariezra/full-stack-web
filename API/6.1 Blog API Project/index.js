import express from "express";
import bodyParser from "body-parser";
import { posts, lastId } from "./config/post.data.js";

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//
//CHALLENGE 1: GET All posts
app.get("/posts", (req, res) => {
  res.json({
    message: "Posts found successfully",
    posts: posts,
  });
});
//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchedPost = posts.find((post) => post.id === id);
  if (searchedPost) {
    res.json({
      message: "Post found successfully",
      post: searchedPost,
    });
  } else {
    res.status(404).json({
      error: "Post not found",
    });
  }
});
//CHALLENGE 3: POST a new post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  const newPost = {
    id: lastId + 1,
    title: title,
    content: content,
    author: author,
    date: new Date().toISOString(),
  };
  posts.push(newPost);
  res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
});
//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, author } = req.body;
  const searchedPost = posts.find((post) => post.id === id);

  if (!searchedPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (title) {
    searchedPost.title = title;
  }
  if (content) {
    searchedPost.content = content;
  }
  if (author) {
    searchedPost.author = author;
  }

  res.json({
    message: "Post updated successfully",
    post: searchedPost,
  });
});
//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchedPost = posts.find((post) => post.id === id);
  if (searchedPost) {
    posts.splice(posts.indexOf(searchedPost), 1);
    res.json({
      message: "Post deleted successfully",
    });
  } else {
    res.status(404).json({
      error: "Post not found",
    });
  }
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
