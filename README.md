# Recipe API

<br>

## Install

**Tech Stack:** Node, Express, Jest

Install via npm `npm install`

Run with `npm start` or more directly with `node server.js`

Test with `npm test`

<br>

## How to Use

Fetch a recipe by ID: GET `/recipes/:id`

E.g., `/recipes/1`

Receive a JSON encoded response of recipe data.

<br>

Set recipe properties by sending an object: POST `/recipes/:id`

E.g., Send `{"title": "new title"}` to `/recipes/1`

Receive a JSON encoded response with the latest recipe data.

Notes: any number of (valid) properties can be sent apart from `id`

<br>

Get a pagination list of recipes by cuisine: GET `/recipes/cuisine/:cuisine?page=0`

E.g., `/recipes/cuisine/italian?page=0`

Receive a JSON encoded response with `items` (recipes), `page` (current page), `more` (if there are more pages).

Notes: pages are zero-indexed. Ten items are returned per page. `page` is not required for the first request.

<br>

## Possible improvements

- A database will be required unless there is going to be one client accessing synchronously.

- The tests currently use a `test-recipe-data.csv` file that isn't reset at the beginning/end of each test. This means tests are not fully replicable.

- An in-memory database would be an improvement both for test speed and replicability.

- The data would benefit from using Model representation.

- Some sections of the code would benefit from being refactored to use `async`/`await` to improve readability.

- All JavaScript files should use JSDoc instead of just `db.js`.
