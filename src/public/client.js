/*
This section of code defines the basic structure and state management for the application.

- The application has an initial state stored using Immutable.js.

- The render function updates the UI based on the current state.

- The updateStore function allows changing specific parts of the state.

- The selectRover function updates the selected rover when clicking on a rover option, triggering a re-render with the new selection.

*/

let store = Immutable.fromJS({
  // This object represents the application's state using Immutable.js
  user: { name: "Student" }, // Stores the user's name
  apod: "", // Initially empty for the Astronomy Picture of the Day
  rovers: ["Curiosity", "Opportunity", "Spirit"], // Available Mars rovers
  selectedRover: "Curiosity", // Currently selected rover
  roverInfo: [], // Initially empty list of rover information
  loading: false, // Indicates if data is being loaded
});

// Get the DOM element where we'll render the app
const root = document.getElementById("root");

const updateStore = (key, value) => {
  // Function to update specific keys in the state
  store = store.set(key, value); // Update the store with the new value
  render(root, store.toJS()); // Re-render the app with the updated state
};

const render = async (root, state) => {
  // Function to render the app based on the state
  root.innerHTML = App(state); // Replace the 'root' element's content with the UI generated by the `App` function
};

const selectRover = (event, name) => {
  // Function called when a rover is selected
  updateStore("selectedRover", name); // Update the 'selectedRover' key in the state with the chosen rover name
};

/*
The App function takes the current application state as an argument. It extracts relevant data from the state: rovers list and selectedRover.

The App then builds the HTML structure using string templates and functions:

- Header and footer placeholders for future content.

Main section containing:

- A personalized greeting based on the user's name retrieved from state.user.name.

A section containing two components:

- Tabs(rovers, selectedRover) generates tabs for available rovers, highlighting the currently selected one.

- DashboardUI(List, state) calls the DashboardUI function.
*/

// create content
const App = (state) => {
  // Extract relevant data from state
  const { rovers, selectedRover } = state;

  // Build the app structure using string templates and functions:

  return `
		<header>
			</header>
		<main>
			${Greeting(state.user.name)}

			<section>
				${Tabs(rovers, selectedRover)}

				${DashboardUI(List, state)}
			</section>
		</main>
		<footer>
			</header>
	`;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store.toJS());
});

/* ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information

Breakdown:

1. The function defines a variable html to store the static HTML content for the greeting.

2. It checks if a name argument is provided.

3. If a name exists:

- Creates a custom welcomeMessage with the provided name using another string template.

- Combines the welcomeMessage with the static html using string concatenation.

- Returns the combined content.

4. If no name exists:

- Simply returns the static html content without any welcome message.

Overall logic:

The Greeting function dynamically generates a personalized greeting based on the provided name. If a name exists, it displays a welcome message with the name. Otherwise, it shows only the static greeting content.
*/

const Greeting = (name) => {
  // Declare a variable to store the HTML content
  let html = `
		<h1 class="title">Mars Dashboard</h1>
		<p class="desc">Click on any of the rovers to view recent pictures.</p>
	`;

  // Check if a name is provided
  if (name) {
    // If name exists, create a welcome message
    const welcomeMessage = `<h1 class="welcome">Welcome, <span class="name">${name}</span></h1>`;

    // Combine the welcome message and the static HTML content
    return welcomeMessage + html;
  } else {
    // If no name exists, use only the static HTML content
    return html;
  }
};

/*
Breakdown:

1. Empty Check: The function first checks if tabLinks is an empty array. If so, it returns an empty string, indicating no tabs to display.

2. Mapping Tab Links: If there are tabs, the function iterates through each link in tabLinks using map.

3. Building Button HTML: For each link, it creates a basic button structure with an onclick event handler that calls selectRover with the link as an argument.

4. Highlighting Selected Tab: If the current link matches the selected parameter, the replace method adds the "active" class and autofocus attribute to the button for visual highlighting.

5. Joining Links and Wrapping: Finally, all the individual button HTML pieces are joined into a single string and wrapped in a <div> with the "tabs" class.

Overall Logic:

The Tabs function dynamically generates a set of tab buttons and highlights the currently selected one based on the provided tabLinks and selected parameters. It builds the HTML structure and leaves event handling to the caller and other functions like selectRover.
*/

const Tabs = (tabLinks, selected) => {
  // Check if there are any available tabs
  if (!tabLinks.length) {
    return ""; // Return empty string if no tabs provided
  }

  // Build the HTML for each tab link
  const tabLinkHtml = tabLinks
    .map((link) => {
      // Define the basic button structure
      let buttonHtml = `<button class="tabLink" onclick="selectRover(event, '${link}')" >${link}</button>`;

      // Check if the current link is the selected one
      if (link === selected) {
        // Add "active" class and focus attribute for the selected tab
        buttonHtml = buttonHtml.replace(
          'class="tabLink"',
          'class="tabLink active" autofocus'
        );
      }

      return buttonHtml;
    })
    .join(""); // Join individual buttons into a single string

  // Wrap all tab links within a "tabs" div
  return `
		<div class="tabs">${tabLinkHtml}</div>
	`;
};

//Explanation of imageHtml Function
/*
Breakdown:

1. Image Element: The function uses a string template to create an <img> element.

2. Source Attribute: It dynamically sets the src attribute of the image based on the image.src property.

3. Date Paragraph: It then creates a <p> element with the class "date".

4. Date Label: Inside the paragraph, it creates a <span> element with the class "bold" for the "Date:" label.

5. Date Content: Finally, it displays the actual date information retrieved from the image.date property.

Overall Logic:

The imageHtml function takes an image object as input and generates the corresponding HTML code to display it along with its date using two nested elements: an image element for the picture and a paragraph element for the date with a styled label.
*/

const imageHtml = (image) => `
	<img src=${image.src}>

	<p class="date">

		<span class="bold">Date: </span>

		${image.date}
	</p>
`;

/* The logic of the DashboardUI function with comments which explains the following key points:

1. The function retrieves rover information and images from the data using helper functions.

2. It checks if the available rover data is for the currently selected rover and not currently loading data. If not, it triggers a new data fetch.

3. It then constructs the UI based on the available information:

- If images are present, it builds the rover details section with name, launch date, landing date, and status followed by the image gallery.

- If no images are present, it displays a "Loading" message.
*/

const DashboardUI = (listComponent, data) => {
  // 1. Fetch rover information and images from the provided data.
  const roverData = getRoverInfo(data);
  const images = getRoverImages(data);

  // 2. Check if rover data is missing or outdated.
  if (
    // Check if there's no data or the selected rover data isn't available
    (!roverData || roverData.name !== data.selectedRover) &&
    // Ensure we're not already loading new data
    !data.loading
  ) {
    // If so, initiate a new data fetch for the selected rover.
    getRoverData(data);
  }

  // 3. Check if image data is available.
  if (images.length) {
    // If images are available, build the rover info section:
    // Title with the selected rover camera.
    return `
        <section class="rover-info">
          <h2>Details for ${roverData.name} rover camera</h2>
          ...
        </section>
      `;
    // ... Include rover details and the image gallery built by listComponent.
  } else {
    // If no images are available, return a loading message.
    return '<p class="loading">Loading Data...</p>';
  }
};

/*
Logic for the 'List' function which explains the steps involved in creating an ordered list:

1. It starts with an empty string for the list HTML.

2. It iterates through each item in the provided data using the map function.

3. For each item, it uses the provided function fn to generate its specific HTML content.

4. It wraps the generated content in a list item element with a class of "image-list".

5. It accumulates the generated list item HTML into the overall list HTML string.

6. Finally, it wraps the complete list HTML in an ordered list element and returns it.

By using the map function and the provided fn, the List function provides a flexible way to generate an ordered list based on any kind of data and custom item representation.
*/

const List = (fn, data) => {
  // 1. Define an empty string to hold the HTML for the list.
  const listHtml = "";

  // 2. Loop through each item in the data using the map function.
  data.map((item) => {
    // 3. Within the map function, use the provided function (fn) to generate the HTML content for each item.
    const itemHtml = fn(item);

    // 4. Wrap the generated HTML content in a list item element with a class of "image-list".
    const listItemHtml = `<li class="image-list">${itemHtml}</li>`;

    // 5. Append the generated list item HTML to the overall listHtml string.
    listHtml += listItemHtml;
  });

  // 6. Once all items are processed, wrap the final listHtml string in an ordered list element (<ol>) and return it.
  return `
      <ol>${listHtml}</ol>
    `;
};

/* Explanation of a pure 'ImageOfTheDay' function that renders infomation requested from the backend

1. The function takes an apod object, presumably containing information about the Astronomy Picture of the Day (APOD).

2. It first checks if apod exists and, if so, whether its date matches today's date. This ensures we only display the current image and avoid unnecessary API calls.

3. If apod is missing or outdated, it triggers a new image fetch by calling getImageOfTheDay(store).

4. Then, it checks the media_type of the provided apod object.

5. If it's a video, the function returns HTML displaying a link to the video with its title and explanation.

6. If it's an image, the function returns HTML with the image itself (using a conditional to handle missing image url) and its explanation.

Key points:

- The function efficiently displays the current APOD by checking its date and media type.

- Separate HTML templates are used for videos and images.

- Logging the dates helps with debugging potential issues.
*/

const ImageOfTheDay = (apod) => {
  // Ensure we either don't have an image or it's outdated:
  const today = new Date(); // Get today's date.
  const photodate = new Date(apod.date); // Get the API-provided image date.

  // Log for debugging: compare photo date's day with today's day.
  console.log(photodate.getDate(), today.getDate());

  if (
    !apod || // No `apod` data or...
    apod.date !== today.getDate()
  ) {
    // ...photo date mismatch,
    getImageOfTheDay(store); // Refetch today's image.
  }

  // Check media type:
  if (apod.media_type === "video") {
    // Video: Display link and details.
    return `
        <p>See today's featured video <a href="${apod.url}">here</a></p>
        <p>${apod.title}</p>
        <p>${apod.explanation}</p>
      `;
  } else {
    // Image: Display image and explanation.
    return `
        <img src="${
          apod.image ? apod.image.url : ""
        }" height="350px" width="100%" />
        <p>${apod.image.explanation}</p>
      `;
  }
};

/*
Explanation of the 'getRoverImages' function:

1. This function takes the state object as input, presumably containing information about the current rover data.

2. It accesses the roverInfo property within the state object, which presumably is an array of objects representing individual rover images.

3. It uses the map function to iterate through each image object in the roverInfo array.

4. Inside the map function, it creates a new object for each image.

5. This new object only contains two properties:

- src: extracted from the img_src property of the original image object.

- date: extracted from the earth_date property of the original image object.

6. Finally, the function returns the array of newly created image objects, each containing only the src and date information needed for displaying the images.

Key points:

- This function extracts and simplifies rover image data for efficient use in displaying the images.

- It uses the map function to perform this data transformation for each image in bulk.

- The returned array of objects is specifically formatted for rendering the images.
*/

const getRoverImages = (state) => {
  // 1. Access the `roverInfo` array within the state object.
  const images = state.roverInfo;

  // 2. Use the `map` function to iterate through each image object in the array.
  const processedImages = images.map((imageData) => {
    // 3. Within the map function, create a new object for each image.
    // 4. Extract the desired properties from the original image object:
    //   - `src`: Set it to the `img_src` property of the original image.
    //   - `date`: Set it to the `earth_date` property of the original image.
    return {
      src: imageData.img_src,
      date: imageData.earth_date,
    };
  });

  // 5. Return the array of newly created image objects.
  return processedImages;
};

/*
Explanation of the 'getRoverInfo' function:

1. his function takes the store object as input, presumably containing information about available rovers and the currently selected one.

2. It accesses the roverInfo property within the state object, which presumably is an array of objects representing individual rovers.

3. It uses the find function to search for the specific rover object that matches the currently selected rover.

4. The find function iterates through each object in the roverInfo array and applies the provided callback function to each.

5. The callback function checks if the rover.name property of the current object matches the value of store.selectedRover.

6. If a match is found, the find function stops iterating and returns the entire object.

7. Inside the getRoverInfo function, if a matching object was found (roverObj is not null), it returns the rover property of that object. This presumably contains detailed information about the selected rover.

8. If no matching object is found (roverObj is null), the function returns undefined.

Key points:

- This function efficiently retrieves information about the currently selected rover from the store.

- It uses the find function with a custom callback to perform selective search based on the chosen rover name.

- The function clearly distinguishes between successful and unsuccessful searches by returning either the rover details or undefined.
*/

const getRoverInfo = (store) => {
  // 1. Access the `roverInfo` array within the store object.
  const roverInfoList = store.roverInfo;

  // 2. Use the `find` function to search for the specific rover object.
  // 3. Pass a callback function to `find` that determines the matching criteria.
  // 4. The callback checks if the `rover.name` property of each imageData object
  //    matches the currently selected rover name (`store.selectedRover`).
  const roverObj = roverInfoList.find(
    (imageData) => imageData.rover.name === store.selectedRover
  );

  // 5. If a matching object is found, return its `rover` property.
  if (roverObj) {
    return roverObj.rover;
  }

  // 6. If no matching object is found, return undefined.
  return undefined;
};

/*
---------- API CALLS ----------
// Explanation of the 'getImageOfTheDay' function:

1. The function starts by extracting the apod property from the state object. This might be used during data logging or error handling.

2. It then makes a fetch request to the APOD API endpoint at http://localhost:3000/apod.

3. If the request is successful, it parses the JSON response and calls the updateStore function with the received APOD data ("apod"). This presumably updates the state object to hold the latest APOD information.

4. If the request fails or encounters an error, it logs the error message to the console.

5. Importantly, the function does not return any value. It performs its work through side effects by interacting with the state and logging errors. This is a common pattern for functions that trigger asynchronous updates.

Key points:

- The function fetches the APOD data from an API and updates the state asynchronously.

- It handles successful responses and potential errors through separate paths.

- It relies on side effects and doesn't directly return the retrieved data.
*/

const getImageOfTheDay = (state) => {
  // 1. Destructure the "apod" property from the state object.
  const { apod } = state;

  // 2. Make a fetch request to the API endpoint (localhost:3000/apod).
  fetch(`https://localhost:3000/apod`)
    .then((res) => res.json()) // Handle successful response
    .then((apodData) => {
      // 3. Update the store with the received APOD data ("apod")
      updateStore("apod", apodData);
    })
    .catch((err) => {
      // Handle network or API errors
      console.log(err);
    });

  // 4. Do not return any value (function is void).

  // Note: The function doesn't directly return the retrieved APOD data
  // because it updates the store asynchronously and relies on side effects.
};

/*
Explanation of the 'getRoverData' function:

1. Similar to the getImageOfTheDay function, it starts by extracting the selectedRover property from the state object.

2. It uses the async keyword to mark the function as asynchronous, allowing us to await the completion of the network request.

3. It constructs the API endpoint URL by adding the selected rover name as a query parameter.

4. It makes a fetch request to the API endpoint and awaits the response using await.

5. If the request is successful, it parses the JSON response and extracts the photos data from the nested data object.

6. It calls the updateStore function with the retrieved photos data to update the state object with the latest rover information.

7. If the request fails or encounters an error, it logs the error message to the console.

8. Similar to the getImageOfTheDay function, it doesn't return any value as it relies on side effects and asynchronous updates.

Key points:

- The function fetches rover photo data for the selected rover from an API asynchronously.

- It uses the async keyword and await keyword to manage the asynchronous nature of the network request.

- It handles successful responses and potential errors through separate paths.

- It relies on side effects and doesn't directly return the retrieved data.
*/

const getRoverData = async (state) => {
  // 1. Destructure the "selectedRover" property from the state object.
  const { selectedRover } = state;

  // 2. Use the "async" keyword to mark the function as asynchronous.
  //   This allows us to "await" the completion of the network request.

  // 3. Construct the API endpoint URL with the selected rover name.
  const url = `https://localhost:3000/rover?rover=${selectedRover}`;

  // 4. Make a fetch request to the API endpoint.
  await fetch(url)
    .then((res) => res.json()) // Handle successful response
    .then(({ data }) => {
      // 5. Extract the "photos" data from the received JSON response.
      const photos = data.photos;

      // 6. Update the store with the retrieved rover photo data ("photos").
      updateStore("roverInfo", photos);
    })
    .catch((err) => {
      // Handle network or API errors
      console.log("err", err);
    });

  // 7. Do not return any value (function is void).

  // Note: The function doesn't directly return the retrieved data
  // because it updates the store asynchronously and relies on side effects.
};
