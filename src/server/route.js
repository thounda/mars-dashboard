// # Importing Dependencies
// Import the Express framework for building API routes.
const express = require("express");

// Import specific controllers for handling API requests.
const { apodController, roverController } = require("./controller");

// # Initializing Express Router
// Create an Express Router instance for handling API endpoints.
const router = express.Router();

// # Defining API Routes
// Define a GET route for 'apod' endpoint using the 'apodController' function.
router.get("/apod", apodController);

// Define a GET route for 'rover' endpoint using the 'roverController' function.
router.get("/rover", roverController);

// # Exporting Router
// Export the router instance to be used by the main application.
module.exports = router;

/*
Purpose Summary:

This code snippet builds and exports an Express Router containing two API endpoints:

/apod: This endpoint handles GET requests for astronomical picture of the day data, and its processing is delegated to the apodController function.

/rover: This endpoint handles GET requests for rover data, and its processing is delegated to the roverController function.

By using a separate router, you can organize your API code and keep it modular, making it easier to maintain and scale.
*/
