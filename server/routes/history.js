/* -------------------------------------------------------------------------- */
/*       Loading all the modules and dependencies for the history routes      */
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
/*           Connection to MongoDB Database and collection "history"          */
/* -------------------------------------------------------------------------- */
async function loadHistoryCollection() {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
  return client.db("playerbase").collection("history");
}

/* -------------------------------------------------------------------------- */
/*                  Routes for the API calls to the history data              */
/* -------------------------------------------------------------------------- */
// Get history data (for testing purposes)
router.get("/", async (req, res) => {
  const history = await loadHistoryCollection();
  res.send(await history.find({}).toArray());
});

// Add game data
router.post("/", async (req, res) => {
  // Load the history collection
  const history = await loadHistoryCollection();

  // Create an array of game rounds with dart rounds
  const gameRounds = req.body.gameRounds.map((gameRound) => {
    return {
      gameRound: gameRound.gameRound,
      dartRounds: gameRound.dartRounds,
    };
  });

  // Insert the game results into the history collection
  await history.insertOne({
    name: req.body.name,
    gameDate: new Date(),
    gameRounds: gameRounds,
  });

  // Send a 201 status code to the client indicating the game results were created successfully
  res.status(201).send();
});

/* -------------------------------------------------------------------------- */
/*                              Export the router                             */
/* -------------------------------------------------------------------------- */
module.exports = router;
