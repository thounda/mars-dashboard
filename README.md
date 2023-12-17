# Functional Programming with Javascript

## Project Instructions

### Big Picture

You are going to create a Mars rover dashboard that consumes the NASA API. Your dashboard will allow the user to select which rover's information they want to view. Once they have selected a rover, they will be able to see the most recent images taken by that rover, as well as important information about the rover and its mission.

Your app will make use of all the functional concepts and practices you have learned in this JavaScript, functional programming course, and the goal is that you would become very comfortable using pure functions and iterating over, reshaping, and accessing information from complex API responses.

### Getting Started

To begin the project, clone the 'starter' branch which contain all the initial code to begin your build.
Follow the, below, steps to get started:

1. We'll start with the typical setup - clone the, starter, repo and install the dependencies

- [ ] To clone the repo, remember to clone just the _starter_ branch:

`git clone --single-branch --branch starter <repo-name>`

- [ ] For this project we are using yarn as our package manager, so to install your depencies run:

`yarn install`

\*\*If you don’t have yarn installed globally, follow their installation documentation here according to your operating system: https://yarnpkg.com/lang/en/docs/install

## Prior to running the `yarn install` command, You need to install the following packages first:

_- Express_
_- Body-parser_
_- Dotenv_
_- immutable.js_

**You can install them using the following command:**

`yarn add immutable express body-parser dotenv`

or

`npm install immutable express body-parser dotenv`

After that run the command `yarn start` or `npm start` in your project's terminal (CLI).

Usually, there shouldn't be any conflicts. You can use either NPM or Yarn.
However,If there are conflicts, try removing the package.lock and node_modules folder and install the packages again.

## Note: If you are more comfortable using npm you can use it instead of yarn.

2. Next you'll need a NASA developer API key in order to access the API endpoints. To do that, go here: https://api.nasa.gov/. If you want to simply look around at what api endpoints NASA offers, you can use their provided DEMO_KEY to do this.

3. In your repo, you will see a .env-example file with a place for your API key. Rename or copy the file to one called `.env` and enter in your key. Now that you have your key, just remember to add it as a parameter to every request you make to NASA.

4. Run `yarn start` in your terminal and go to `http:localhost:3000` to check that your app is working. If you don't see an image on the page, check that your api key is set up correctly.

5. Remember to commit frequently, use branches, and leave good commit messages! You'll thank yourself later.

### Project Requirements

To complete this project, your UI must show the following:

- [ ] A gallery of the most recent images sent from each mars rover
- [ ] The launch date, landing date, name and status along with any other information about the rover
- [ ] A selection bar for the user to choose which rover's information they want to see

To complete this project, your UI must do the following:

- [ ] Be responsive. Needs to look good(aka not broken) on phones(max width 768px) and desktop(min-width 991px, max-width 1824px). Tablet view is optional.
- [ ] Provide a way to dynamically switch the UI to view one of the three rovers
      \*\*This can be done using tabs, buttons, or any other UI control

To complete this project, your frontend code must:

- [ ] Use only pure functions
- [ ] Use at least one Higher Order Function
- [ ] Use the array method `map`
- [ ] Use the ImmutableJS library

To complete this project, your backend code must:

- [ ] Be built with Node/Express
- [ ] Make successful calls to the NASA API
- [ ] Use pure functions to do any logic necessary
- [ ] Hide any sensetive information from public view (In other words, use your dotenv file)

#### "Happy coding with functional programming in JavaScript!"
