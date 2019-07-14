/**
 * @module db - This data handling module of the Recipe API.
 * A CSV file passed in via environment value is used for storage.
 */

const fs = require("fs");
const path = require("path");
const csv = require("csv");

let DB;
if (process.env.NODE_ENV === "test") {
  DB = "data/test-recipe-data.csv";
} else {
  DB = process.env.DB || "data/recipe-data.csv";
}

/**
 *
 * @return {Promise} A Promise that resolves to recipe data (an array of recipe objects).
 */
function read() {
  return new Promise((resolve, reject) => {
    filePath = path.join(__dirname, DB);
    // Read CSV file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      // Parse loaded content
      csv.parse(data, { columns: true }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  });
}

/**
 *
 * @return {Promise} A Promise that resolves when recipes are saved.
 */
function save(data) {
  return new Promise((resolve, reject) => {
    filePath = path.join(__dirname, DB);
    // Convert recipe data to CSV
    csv.stringify(data, { header: true }, (err, output) => {
      if (err) {
        reject(err);
      }
      // Write CSV file
      fs.writeFile(filePath, output, (err, _) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  });
}

/**
 *
 * @param {string} id - A recipe id.
 * @return {Promise} A Promise resolving to that recipe or undefined.
 */
function getById(id) {
  return read().then(data => data.find(recipe => recipe.id == id));
}

/**
 *
 * @param {string} id - A recipe id.
 * @param {Object} body - Recipe fields and values to update.
 * @return {Promise} A Promise resolving to that recipe.
 */
function setById(id, body) {
  // Update a recipe
  function updateRecipe(recipe) {
    for (const key in body) {
      // Don't allow index altering
      if (key === "id") {
        continue;
      }
      // Don't allow new field creation
      if (recipe.hasOwnProperty(key)) {
        recipe[key] = body[key];
      }
    }
    return recipe;
  }

  // Find recipe to update
  return read().then(data => {
    for (let i = 0; i < data.length; i++) {
      const recipe = data[i];
      if (recipe.id == id) {
        data[i] = updateRecipe(recipe);
        return new Promise((resolve, reject) => {
          save(data).then(status => resolve(recipe));
        });
      }
    }
  });
}

/**
 *
 * @param {string} cuisine - A cuisine.
 * @param {string} page - Zero-indexed page offset from the start of the recipes (ordered by id).
 * @param {string} pagination - Paginate by this amount.
 * @return {Promise} A Promise resolving an object containing recipes and page information.
 * {items, page, more}. items - , page - Current zero-indexed page, more: More results (Boolean).
 * To cycle through all the cuisine results, call this route with an incrementing `page` argument.
 * Notes: This function should be cached. The `reduce` is a stopgap for an efficient database
 * call.
 */
function getByCuisine(cuisine, page, pagination = 10) {
  return read().then(data => {
    // Filter recipes and trim fields
    const filtered = data.reduce((filtered, recipe) => {
      if (recipe.recipe_cuisine === cuisine) {
        const { id, title, marketing_description } = recipe;
        filtered.push({ id, title, marketing_description });
      }
      return filtered;
    }, []);
    const offset = pagination * page;
    const items = filtered.slice(offset, offset + pagination);
    return {
      items: items, // Recipes
      page: page, // Current page, zero-indexed
      more: filtered.length > offset + pagination // Are there are more pages?
    };
  });
}

module.exports.getById = getById;
module.exports.setById = setById;
module.exports.getByCuisine = getByCuisine;
