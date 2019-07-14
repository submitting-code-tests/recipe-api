/**
 * @module app - This is the Express app of the Recipe API.
 * `db.js` has further documentation on recipe data handling.
 */

const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const db = require("./db");

// Get all fields for a recipe
app.get("/recipes/:id", (req, res) =>
  db.getById(req.params.id).then(recipe => res.send(recipe))
);

// Update one or many fields of a recipe, gets all fields
app.post("/recipes/:id", (req, res) =>
  db.setById(req.params.id, req.body).then(recipe => res.send(recipe))
);

// Get paginated list of recipes filtered by cuisine. Use `?page=0` to go through all pages
// returns recipes, current page, and whether there are `more` pages of content available
app.get("/recipes/cuisine/:cuisine", (req, res) =>
  db
    .getByCuisine(req.params.cuisine, req.query.page || 0, 10)
    .then(recipes => res.send(recipes))
);

module.exports = app;
