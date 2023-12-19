// Load environment variables from a `.env` file.
require("dotenv").config();
// Import dependencies - packages to script
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Create an Express application instance.
const app = express();

// Import all routes from the 'route' file.
const appRouter = require("./route");

// Import specific controllers for handling not found and error situations.
const { notFoundController, errorController } = require("./controller");

// specify port # for connection
const port = 3000;

// Use bodyParser to parse URL-encoded data (extended: false for basic parsing).
app.use(bodyParser.urlencoded({ extended: false }));

// Use bodyParser to parse JSON data in requests.
app.use(bodyParser.json());

// Serve static files from the '../public' directory under the root path ('/').
app.use("/", express.static(path.join(__dirname, "../public")));

// Use all routes defined in 'appRouter' for requests starting with '/'.
app.use("/", appRouter);

/* Defining routing rules  */
// Handle requests that reach no specific route (404 Not Found).
app.use(notFoundController);

// Handle any errors that occur during request processing.
app.use(errorController);

// Start the Express app on port 3000 and log a message.
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
