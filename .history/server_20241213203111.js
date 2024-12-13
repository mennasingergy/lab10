// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Mock data for demonstration
let users = [
  { id: 1, name: "Menna", email: "menna@example.com" },
  { id: 2, name: "sara", email: "sara@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" }
];

// Endpoints

// Get all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Test API running on http://localhost:${PORT}`);
});
