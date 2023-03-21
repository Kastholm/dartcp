/* -------------------------------------------------------------------------- */
/*          Loading all the modules and dependencies for the database         */
/* -------------------------------------------------------------------------- */
// Loading dotenv to access environment variables
require("dotenv").config();
// Loading express for handling API routes
const express = require("express");
// Loading mongodb to interact with MongoDB database
const mongodb = require("mongodb");
// Loading router to define and handle routes
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*            Connection to MongoDB Database and collection "Players"         */
/* -------------------------------------------------------------------------- */
async function loadPlayersCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
  return client.db("playerbase").collection("players");
}

/* -------------------------------------------------------------------------- */
/*                  Routes for the API calls to the database                  */
/* -------------------------------------------------------------------------- */
// Get players (for testing purposes)
router.get("/", async (req, res) => {
  const players = await loadPlayersCollection();
  res.send(await players.find({}).toArray());
});

// Add player
router.post("/", async (req, res) => {
  // Load the players collection
  const players = await loadPlayersCollection();
  // Insert a new player into the collection with provided data
  console.log(req.body);
  console.log(req.body.name);
  await players.insertOne({
    name: req.body.name,
    dailyPoints: req.body.dailyPoints,
    yearlyPoints: req.body.yearlyPoints,
  });
  // Send a 201 status code to the client indicating the player was created successfully
  res.status(201).send();
});

/* -------------------------------------------------------------------------- */
/*                              Export the router                             */
/* -------------------------------------------------------------------------- */
module.exports = router;
