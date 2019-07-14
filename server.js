/**
 * @module server - This is the entry file for the Recipe API.
 * The Express server is launched here.
 */
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Recipe API listening on port ${PORT}!`));
