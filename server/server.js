/* -------------------------------------------------------------------------- */
/*           Loading all the modules and dependencies for the server          */
/* -------------------------------------------------------------------------- */
// Loading Express
const express = require("express");
// Loading HTTP module
const http = require("http");
// Loading Body Parser
const bodyParser = require("body-parser");
// Loading CORS (Cross-Origin Resource Sharing)
const cors = require("cors");
// Creating an Express app
const app = express();
// Loading node-cron for scheduling tasks
const cron = require("node-cron");

/* -------------------------------------------------------------------------- */
/*                 Running middleware for body parser and CORS                */
/* -------------------------------------------------------------------------- */
// Configuring Body Parser middleware to parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* -------------------------------------------------------------------------- */
/*                  Configure CORS to accept every connection                 */
/* -------------------------------------------------------------------------- */
// Configuring CORS middleware to allow any origin and various HTTP methods
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE",
  })
);

/* -------------------------------------------------------------------------- */
/*                   Routes for the API calls to the server                   */
/* -------------------------------------------------------------------------- */
// Importing Players routes from the "routes/players" module
const players = require("./routes/players");
// Mounting the Players routes at "/players" path
app.use("/players", players);

/* -------------------------------------------------------------------------- */
/*                Schedule the daily reset at midnight (04:00)                */
/* -------------------------------------------------------------------------- */
cron.schedule("0 0 * * *", async () => {
  try {
    await axios.put("http://localhost:3000/players/reset-daily-points");
    console.log("Daily points reset successfully");
  } catch (error) {
    console.error("Error resetting daily points:", error);
  }
});

/* -------------------------------------------------------------------------- */
/*                    Setting port for the server to run on                   */
/* -------------------------------------------------------------------------- */
// Setting the port for the server, either from the environment variable or defaulting to 3000
const port = process.env.PORT || 3000;
// Starting the server and listening for incoming connections on the specified port
app.listen(port, () => console.log(`Server started on port ${port}`));
