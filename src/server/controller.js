/*
By adding comments, we clarify the purpose of each step, what information is extracted and used, and the flow of execution for both success and error scenarios. This improves the code's readability and debugability.

Explanation of Fetch / Async Await process:
------------------------------------------

1. Importing 'node-fetch': We import the node-fetch package which allows us to make HTTP requests in Node.js.

2. Defining 'fetchData' function: We define an asynchronous function named fetchData which takes a url parameter. This function will fetch data from the given URL and return it as a JavaScript object.

3. Making the HTTP request: Inside the function, we use fetch(url) to make an asynchronous HTTP GET request to the provided URL. This returns a Promise object representing the response.

4. Processing the response: We use then to chain a callback function onto the Promise returned from fetch. This callback function receives the response object (res) as an argument.

5. Parsing JSON data: Inside the callback function, we call res.json() to parse the JSON body of the response and convert it into a JavaScript object. This parsed object is then stored in the variable data.

6. Returning the data: Finally, we return the data object from the fetchData function. This means that the caller of the function will receive the parsed JSON data fetched from the given URL.
*/
const fetch = require("node-fetch"); // Import the 'node-fetch' package for making HTTP requests.

const fetchData = async (url) => {
  // Define an asynchronous function named 'fetchData' that takes a 'url' parameter.
  const data = await fetch(url) // Make an asynchronous HTTP GET request to the provided URL.
    .then((res) => res.json()); // Once the response is received, convert the JSON body to a JavaScript object.
  return data; // Return the parsed JSON data from the response.
};

/*
This snippet of code defines an asynchronous function apodController that handles requests for Astronomy Picture of the Day (APOD) data.
*/

// Define an asynchronous function named 'apodController' that takes 'req' and 'res' objects as arguments.
const apodController = async (req, res) => {
  // Construct the NASA APOD API URL:
  const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`;

  try {
    // Try to fetch data from the NASA APOD API:
    let image = await fetchData(apodUrl); // Call the 'fetchData' function with the constructed URL to get the parsed JSON data.
    // Set HTTP status code to 200 OK and return a JSON response with the 'image' object from the API data:
    return res.status(200).json({ image });
  } catch (err) {
    // If any error occurs while fetching data:
    console.log("Error:", err); // Log the error for debugging purposes.
    // Pass the error to the next error handler using 'next' if configured.
    next(err);
  }
};

/*
Below, is the async / function logic for the 'roverController' constant:

1. Extracting rover name: The function retrieves the desired rover name from the 'req.query' object, which stores query parameters from the request URL.

2. Logging and building URL: It logs the requested rover name for debugging purposes, then constructs the NASA Mars Photos API URL. The URL includes the specified rover name, 'sol=900' (a Martian day), and the API key from the environment variable.

3. Fetching data and handling success: Similar to the 'apodController', it uses the fetchData function to get the parsed JSON data from the constructed URL. If successful, it sets the HTTP status code to 200 (OK) and returns a JSON response containing the 'data' object from the API response.

4. Handling errors: If any error occurs while fetching the data, it logs the error message and passes it to the next error handler using the 'next' function (if configured).
*/

const roverController = async (req, res, next) => {
  // Define an asynchronous function named 'roverController' that takes 'req', 'res', and 'next' objects as arguments.
  // Extract the rover name from the request query:
  const rover = req.query.rover;
  console.log(`Received request for rover: ${rover}`); // Log the requested rover for debugging purposes.

  // Construct the NASA Mars Photos API URL with the selected rover and sol=900:
  const roverUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=900&api_key=${process.env.API_KEY}`;

  try {
    // Try to fetch data from the NASA Mars Photos API:
    let data = await fetchData(roverUrl); // Call the 'fetchData' function with the constructed URL to get the parsed JSON data.
    // Set HTTP status code to 200 OK and return a JSON response with the 'data' object from the API response:
    return res.status(200).json({ data });
  } catch (err) {
    // If any error occurs while fetching data:
    console.log("Error:", err); // Log the error message for debugging purposes.
    // Pass the error to the next error handler using 'next' if configured.
    next(err);
  }
};

/*
The purpose of the notFoundController function is specifically designed to handle situations where the requested resource cannot be found and to initiate the appropriate error handling response.


1. Creates an Error object: The function constructs a new Error object with the message "Not Found". This signifies an error condition where the requested resource could not be found.

2. Sets the error status code: The err.status property is set to 404, which is the standard HTTP status code for "Not Found" responses. This informs the client that the requested resource is unavailable.

3. Passes the error to the 'next' handler: Finally, the function uses the next function to pass the created error object to the next error handler in the application's middleware chain. The next handler is then responsible for handling the 404 error and potentially sending an appropriate response to the client.
*/

const notFoundController = (req, res, next) => {
  // Define a function named 'notFoundController' that takes 'req', 'res', and 'next' objects as arguments.
  // Create a new Error object with the message "Not Found":
  const err = new Error("Not Found");

  // Set the error status code to 404 (Not Found):
  err.status = 404;

  // Pass the error to the next error handler using 'next':
  next(err);
};

/*
The, below, errorController, function clarifies the conditional behavior based on the environment and how the response is assembled with the message and potentially the full error details. The function enhances the code's readability and understanding of its error handling logic.

1. Initializing and extracting error info: The function starts by initializing an empty error variable and then extracts the error message from the provided err object.

2. Conditional error details inclusion: It checks the current environment using process.env.NODE_ENV. If it's development or not test, it assigns the entire err object to the error variable. This means in development and non-test environments, the full error details are included in the response.

3. Setting status code: The response status code is set based on the provided error's status property if available, or defaults to 500 (Internal Server Error) if not.

4. Response construction: Finally, the function constructs a JSON response containing the extracted message and the optional error object if included based on the environment.
*/

const errorController = (err, req, res, next) => {
  // Define a function named 'errorController' that takes 'err', 'req', 'res', and 'next' objects as arguments.
  // Initialize an empty 'error' variable:
  let error = null;

  // Extract the error message:
  const message = err.message;

  // Determine whether to include full error details based on environment:
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV !== "test"
  ) {
    error = err; // Include full error object in development and non-test environments.
  }

  // Set the response status code to the error's code or default to 500:
  res.status(err.status || 500);

  // Return a JSON response with the message and optional error details:
  res.json({ message, error });
};

/*
The provided code exports four functions as a module:

- apodController: This function handles requests for the Astronomy Picture of the Day (APOD) data from NASA.

- roverController: This function handles requests for photos taken by Mars rovers, taking the desired rover name from the request query.

- errorController: This function handles any errors that occur in the application and sends an appropriate response to the client. It may include full error details in development or non-test environments.

- notFoundController: This function specifically handles situations where the requested resource cannot be found and sets the appropriate error status code (404) for the client.
*/

// Export four functions from this module:
module.exports = {
  apodController, // Handles requests for Astronomy Picture of the Day data.
  roverController, // Handles requests for Mars rover photos.
  errorController, // Handles and sends responses for errors.
  notFoundController, // Handles situations where the requested resource is not found.
};
