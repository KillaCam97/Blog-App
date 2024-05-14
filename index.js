import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function generateUniqueId() {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  return uniqueId;
}

let posts = [];

// GET route for home page
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

// POST route for form submission (create new post)
app.post("/", (req, res) => {
  const { name, title, content, date } = req.body;

  const postId = generateUniqueId();

  // Create a new post object with current date
  const newPost = {
    id: postId, // Assign the generated ID
    name: name,
    title: title,
    content: content,
    date: new Date(date).toLocaleDateString(),
  };

  // Add the new post to the posts array
  posts.push(newPost);

  // Redirect to the home page after creating the post
  res.redirect("/");
});

// GET route for editing a post
app.get("/posts/:postId/edit", (req, res) => {
  const postId = req.params.postId;

  const post = posts.find((post) => post.id === postId);

  if (!post) {
    console.log("Post not found");
    res.status(404).send("Post not found");
    return;
  }

  res.render("edit.ejs", { post: post });
});

// POST route for updating a post
app.post("/posts/:postId/edit", (req, res) => {
  const postId = req.params.postId;
  const { name, title, content, date } = req.body;

  // Find the post by its ID
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex === -1) {
    res.status(404).send("Post not found");
    return;
  }

  // Update the post with new data
  posts[postIndex] = {
    id: postId,
    name: name,
    title: title,
    content: content,
    date: new Date(date).toLocaleDateString(),
  };

  // Redirect back to the home page
  res.redirect("/");
});

// POST route for deleting a post
app.post("/posts/:postId/delete", (req, res) => {
  const postId = req.params.postId;

  // Filter out the post to delete from the posts array
  posts = posts.filter((post) => post.id !== postId);

  // Redirect back to the home page after deleting the post
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
