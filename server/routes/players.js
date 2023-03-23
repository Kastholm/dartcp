/* -------------------------------------------------------------------------- */
/*          Loading all the modules and dependencies for the database         */
/* -------------------------------------------------------------------------- */
// Loading dotenv to access environment variables
require("dotenv").config();
// Loading express for handling API routes
const express = require("express");
// Loading mongodb to interact with MongoDB database
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectId;
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
    roundsTaken: 0,
  });
  // Send a 201 status code to the client indicating the player was created successfully
  res.status(201).send();
});

// Update player's dailyPoints
router.put("/:id/update-points", async (req, res) => {
  const playerId = req.params.id;
  const pointsToAdd = req.body.dailyPoints;

  const players = await loadPlayersCollection();
  await players.updateOne(
    { _id: new ObjectID(playerId) },
    { $inc: { dailyPoints: pointsToAdd } }
  );
  // Return the updated player data
  const updatedPlayer = await players.findOne({ _id: new ObjectID(playerId) });
  res.status(200).send(updatedPlayer);
});
// Reset dailyPoints for all players after 24 hours (set in server.js)
router.put("/reset-daily-points", async (req, res) => {
  const players = await loadPlayersCollection();
  await players.updateMany({}, { $set: { dailyPoints: 0 } });
  res.status(200).send();
});

// Update yearlyPoints based on dailyPoints ranking
router.put("/update-yearly-points", async (req, res) => {
  const players = await loadPlayersCollection();
  const allPlayers = await players.find({}).toArray();

  // Sort the players based on their daily points in ascending order
  const sortedPlayers = allPlayers.sort(
    (a, b) => a.dailyPoints - b.dailyPoints
  );

  // Iterate through the sorted players and update their yearly points
  for (let i = 0; i < sortedPlayers.length; i++) {
    const playerId = sortedPlayers[i]._id;
    const pointsToAdd = i + 1; // The player's rank is their index in the sorted array plus 1
    await players.updateOne(
      { _id: new ObjectID(playerId) },
      { $inc: { yearlyPoints: pointsToAdd } }
    );
  }

  res.status(200).send();
});

// Update roundsTaken for a player
router.put("/:id/update-rounds-taken", async (req, res) => {
  const players = await loadPlayersCollection();
  const playerId = new mongodb.ObjectId(req.params.id);
  const roundsTaken = req.body.roundsTaken;

  await players.updateOne(
    { _id: playerId },
    { $set: { roundsTaken: roundsTaken } }
  );

  res.status(200).send(await players.findOne({ _id: playerId }));
});

/* -------------------------------------------------------------------------- */
/*                              Export the router                             */
/* -------------------------------------------------------------------------- */
module.exports = router;
