<template>
  <section>
    <div class="playersTable">
      <!-- Looping through players in playerbase and filtering them by dailyscore -->
      <div
        class="player"
        v-for="(player, index) in filteredPlayers"
        :key="player._id"
        :class="{ activePlayer: index === activePlayerIndex }"
      >
        <!-- Adding player name to table -->
        <span class="empty"
          ><input class="playerName" :value="player.name" />
        </span>
        <!-- Adding 11 scoretables with a loop -->
        <span v-for="boxes in 11" :key="boxes" class="check">
          <input
            type="checkbox"
            ref="checkboxRefs[index][boxes][0]"
            @change="checkScored(index, boxes)"
          />
          <input
            type="checkbox"
            ref="checkboxRefs[index][boxes][1]"
            @change="checkScored(index, boxes)"
          />
          <input
            type="checkbox"
            ref="checkboxRefs[index][boxes][2]"
            @change="checkScored(index, boxes)"
          />
        </span>
        <div style="display: grid">
          <button class="next" @click="nextPlayer(index)">Næste spiller</button>
          <button class="next checkAll" @click="checkAll()">check all</button>
        </div>
      </div>
    </div>
    <!-- RightPanel -->
    <div class="rightPanel" v-for="player in filteredPlayers" :key="player._id">
      <div class="rightPanelBody">
        <div v-if="gameStarted" class="gameInfo">
          <h2 class="currentPlayer">
            Spiller:<br /><b>{{ activePlayer ? activePlayer.name : "" }}</b>
          </h2>
          <h2 class="pointIndicator">
            Dagens Point:<br /><b>{{
              activePlayer ? activePlayer.dailyPoints : ""
            }}</b>
          </h2>
          <h2 class="pointIndicator">
            Årlige Point:<br /><b>{{
              activePlayer ? activePlayer.yearlyPoints : ""
            }}</b>
          </h2>
          <br />
          <h2 class="round">
            Runde: <br /><b>
              {{ round }}
            </b>
          </h2>
          <h2 class="round">
            Spil: <br /><b>
              {{ gameNumber }}
            </b>
          </h2>
        </div>
        <div v-else class="gameInfo">
          <h1>Dagens Point</h1>
          <span
            class="pointGrid"
            v-for="(player, index) in players"
            :key="player._id"
          >
            <h2 class="currentPlayer">
              <b>{{ player.name }}</b>
            </h2>
            <span>
              <h2 class="pointIndicator"><br />{{ player.dailyPoints }}</h2>
              <!-- <h2 class="pointIndicator">
                Årets Point <br />{{ player.yearlyPoints }}
              </h2> -->
            </span>
          </span>
        </div>
      </div>
      <button
        @click="openMenu()"
        class="start"
        style="background: #024d02; color: #fbfbfb; font-size: 1.4rem"
      >
        Menu<i class="fa-solid fa-arrows-rotate"></i>
      </button>
    </div>
    <div class="menu">
      <div class="buttons">
        <router-link to="/history"
          ><button class="log" style="background: #433010">
            Spil Historik
          </button></router-link
        >
        <div class="playerIndex">
          <button class="highScore" style="background: blue">
            highscore spil<i class="fa-solid fa-user-minus"></i>
          </button>
        </div>

        <div class="gameProgress">
          <button
            @click="startGame()"
            class="start"
            style="background: #024d02"
          >
            Start Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button
            @click="restartGame"
            class="restart"
            style="background: #540c0c"
          >
            Genstart Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button @click="endGame" class="restart" style="background: #050554">
            Gem Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button @click="openMenu()" class="start" style="background: #024d02">
            Luk Menu<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import rightPanel from "@/components/rightPanel.vue";

import winnerImg from "@/assets/img/trophy.gif";
//Importing sweetalert2
import Swal from "sweetalert2";
// importing historyService from composable
import historyService from "@/composables/historyComposable.js";
// importing playerService from composable
import playerService from "@/composables/playersComposable.js";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, computed } from "vue";
// ref players array to store players from the server
const players = ref([]);
// Game data that should be added to histry log
let allGameData = [];
// Mount players from the server
onMounted(async () => {
  // Getting players from the server
  players.value = await playerService.getPlayers();
});
// ref filteredPlayers array to store players from the server
const filteredPlayers = ref([]);
// Watch players array and sort them by dailyPoints
watch(players, () => {
  filteredPlayers.value = players.value.sort(
    (a, b) => b.dailyPoints - a.dailyPoints
  );
});

// Start game function
// Connecting the active player to the player table
const playerClass = (index) => ({
  activePlayer: index === activePlayerIndex.value,
});
// Connecting to post request to update player points
const updatePlayerPoints = async (playerId, pointsToAdd) => {
  await playerService.updateDailyPoints(playerId, pointsToAdd);
};
// Set active player to -1 by default because there are no starting players yet
const activePlayerIndex = ref(-1);
// Set gameStarted to false by default because the game hasn't started yet
const gameStarted = ref(false);
// Set round to 0 by default
const round = ref(0);
// Set dailyPoints to 0 by default
const dailyPoints = ref(0); // define dailyPoints here

// When you click on Start game button, set active player to 0 (first player)
function startGame() {
  // Exits Menu
  document.querySelector(".menu").classList.remove("active");
  // Set the active player to the first player
  activePlayerIndex.value = 0;
  // Set gameStarted to true
  gameStarted.value = true;
  // set round to 1
  round.value = 1;
}
// When you click on Next player button, set active player to the next player
function nextPlayer(index) {
  // Set the active player to the next player
  let nextPlayerIndex = (index + 1) % filteredPlayers.value.length;
  let nextPlayer = filteredPlayers.value[nextPlayerIndex];
  // Increment the round if the next player's index is smaller than the current player's index
  // or if the next player's index is the same as the current player's index
  if (nextPlayerIndex < index || nextPlayerIndex === index) {
    round.value++;
  }

  // Check if the next player has all checkboxes checked
  while (
    document.querySelectorAll(
      `.player:nth-child(${
        nextPlayerIndex + 1
      }) .check:not(.scored) input[type=checkbox]:not(:checked)`
    ).length === 0
  ) {
    nextPlayerIndex = (nextPlayerIndex + 1) % filteredPlayers.value.length;
    nextPlayer = filteredPlayers.value[nextPlayerIndex];
  }
  // Set the active player to the next player
  activePlayerIndex.value = nextPlayerIndex;

  // Display a success message with the name of the next player
  Swal.fire({
    position: "middle",
    icon: "success",
    title: `<h1 style='margin-bottom: .8em; font-size: 2.3rem;'>${nextPlayer.name}'s tur</h1><br><b style='font-size: 4rem;'></b>`,
    showConfirmButton: false,
    timer: 2000,
  });
}
// Get the active player from the filteredPlayers array by using the activePlayerIndex value as index number in the array and store it in a computed variable
const activePlayer = computed(() => {
  if (activePlayerIndex.value !== -1) {
    return filteredPlayers.value[activePlayerIndex.value];
  } else {
    return null;
  }
});

// Add a class to the scoretable span when all checkboxes are checked
// Sets the number of completed players to 0 by default
let completedPlayers = 0;
console.log("default placement", completedPlayers);
function checkScored(index, finishOthers = true) {
  const playerDiv = document.querySelector(
    `.player:nth-child(${activePlayerIndex.value + 1})`
  );
  const spans = playerDiv.querySelectorAll(".check");
  // Select all spans for the active player
  spans.forEach((span) => {
    // Select all checkboxes in the span
    const checkboxes = span.querySelectorAll("input[type=checkbox]");
    // Check if all checkboxes are checked
    const isChecked = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    // Add or remove the 'scored' class based on if all checkboxes are checked
    if (isChecked) {
      span.classList.add("scored");
    } else {
      span.classList.remove("scored");
    }
  });
  // Check if all checkboxes for the player are checked
  const allCheckboxes = playerDiv.querySelectorAll("input[type=checkbox]");
  const allChecked = Array.from(allCheckboxes).every(
    (checkbox) => checkbox.checked
  );
  // Add or remove the 'winPlayer' class based on if all checkboxes are checked
  //playerDiv.classList.remove("activePlayer");
  if (allChecked) {
    playerDiv.classList.add("winPlayer");
    const playerName = playerDiv.querySelector(".playerName").value;
    // Increment the number of completed players (placement)
    console.log("increased placement", completedPlayers);
    completedPlayers++;
    // Adding <p>  to the player div with the placement number
    if (completedPlayers === 1) {
      const placement = completedPlayers;
      const placementElement = document.createElement("p");
      placementElement.classList.add("placement");
      placementElement.innerHTML = `<b style='color:rgb(241, 232, 60);'>${placement}</b><br>Plads`;
      playerDiv.appendChild(placementElement);
      // Add game data to the history database
      const gameData = {
        name: playerName,
        gameRounds: [
          {
            gameRound: getGameNumber(), // Retrieve the current game round using getGameNumber()
            dartRounds: round.value, // Use the 'round' value for dartRounds
            placement: completedPlayers, // Use the 'completedPlayers' value for placement
          },
        ],
      };
      historyService.addHistory(gameData).catch((error) => {
        console.error(error);
      });
    }
    const pointsToAdd = completedPlayers;
    playerService
      .updateDailyPoints(players.value[index]._id, pointsToAdd)
      .then((updatedPlayer) => {
        // Update the player's dailyPoints in the local players array
        players.value[index] = updatedPlayer;
      })
      .catch((error) => {
        console.error(error);
      });
    // Adds how fast the player finished the game to the database according to rounds taken
    const roundsTaken = round.value;
    playerService
      .updateRoundsTaken(players.value[index]._id, roundsTaken)
      .then((updatedPlayer) => {
        // Update the player's roundsTaken in the local players array
        players.value[index] = updatedPlayer;
      })
      .catch((error) => {
        console.error(error);
      });

    if (finishOthers) {
      // When a player completes the game, finish the remaining players
      // This stops the function when all players have finished
      finishRemainingPlayers(playerDiv);
    }

    /* Swal.fire(
      `<img src='${winnerImg}'><p class='winRespond'><b>Tillykke</b><b><br style='margin: .5em;'> ${playerName}!</b><br><br>du tog ${completedPlayers} pladsen<br><br>efter ${round.value} Runde </p>`,
      "",
      ""
    ); */
    /* celebrate();
    setTimeout(() => {
      celebrate();
    }, "1000"); */
  } /* else {
    playerDiv.classList.remove("winPlayer");
  } */
  // Update the dailyPoints displayed in the player table
}

function finishRemainingPlayers(completedPlayerDiv) {
  // Get all players, excluding the completed player
  const remainingPlayers = Array.from(
    document.querySelectorAll(".player")
  ).filter((playerDiv) => playerDiv !== completedPlayerDiv);

  // Create an object to group remaining players by their checked boxes count
  const playerGroups = {};

  remainingPlayers.forEach((playerDiv) => {
    const checkedCount = playerDiv.querySelectorAll(
      "input[type=checkbox]:checked"
    ).length;

    if (!playerGroups[checkedCount]) {
      playerGroups[checkedCount] = [];
    }

    playerGroups[checkedCount].push(playerDiv);
  });

  // Sort the checked boxes counts in descending order
  const sortedCounts = Object.keys(playerGroups)
    .map((count) => parseInt(count, 10))
    .sort((a, b) => b - a);

  // Process each group of players with the same checked boxes count
  sortedCounts.forEach((count) => {
    const playerGroup = playerGroups[count];
    finishRemainingPlayersByGroups(playerGroup);
  });
}

function finishRemainingPlayersByGroups(playerGroup) {
  // If the group has only one player, finish the player
  if (playerGroup.length === 1) {
    finishPlayer(playerGroup[0]);
    return;
  }

  // If the group has more than one player, check if they have a clear difference
  // in checked boxes count compared to the next group
  const currentCheckedCount = playerGroup[0].querySelectorAll(
    "input[type=checkbox]:checked"
  ).length;

  const nextPlayer = document.querySelector(
    `.player:not(.winPlayer):not([data-checked="${currentCheckedCount}"])`
  );

  if (nextPlayer) {
    const nextCheckedCount = nextPlayer.querySelectorAll(
      "input[type=checkbox]:checked"
    ).length;

    if (currentCheckedCount !== nextCheckedCount) {
      playerGroup.forEach((playerDiv) => {
        finishPlayer(playerDiv);
      });
    }
  }
}

function finishPlayer(playerDiv) {
  checkAllCheckFieldsForPlayer(playerDiv);

  // Find the player's index in the players array
  const playerName = playerDiv.querySelector(".playerName").value;
  const playerIndex = players.value.findIndex(
    (player) => player.name === playerName
  );

  // Call checkScored for the player to give them a placement, and set finishOthers to false
  checkScored(playerIndex, false);
  completedPlayers++;
  playerDiv.classList.add("winPlayer");
  const placement = completedPlayers;
  const placementElement = document.createElement("p");
  placementElement.classList.add("placement");
  placementElement.innerHTML = `<b style='color:rgb(241, 232, 60);'>${placement}</b><br>Plads`;
  playerDiv.appendChild(placementElement);

  // Add game data to the history database
  const gameData = {
    name: playerName,
    gameRounds: [
      {
        gameRound: getGameNumber(),
        dartRounds: round.value,
        placement: completedPlayers,
      },
    ],
  };
  historyService.addHistory(gameData).catch((error) => {
    console.error(error);
  });
}

// Sets the game number for the game in localStorage().
const getGameNumber = () => {
  const gameInfo = JSON.parse(localStorage.getItem("gameInfo"));

  if (gameInfo) {
    const lastGameTimestamp = new Date(gameInfo.timestamp);
    const now = new Date();
    const timeDifference = now - lastGameTimestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDifference > oneDay) {
      // More than 24 hours have passed, reset the game number
      setGameNumber(1);
      return 1;
    } else {
      return gameInfo.gameNumber;
    }
  } else {
    // No gameInfo found in localStorage, set initial game number
    setGameNumber(1);
    return 1;
  }
};

const setGameNumber = (gameNumber) => {
  const gameInfo = {
    gameNumber: gameNumber,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
};

function incrementGameNumber() {
  const currentGameNumber = getGameNumber();
  setGameNumber(currentGameNumber + 1);
}

const restartGame = () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-success",
    },
    buttonsStyling: true,
  });
  swalWithBootstrapButtons
    .fire({
      title: `<br><h5>Dette vil <b style='color: red ' ><br>slette dart points </b><br> og starte en <br> <b>ny spilrunde<br></br></h5></h5>`,
      text: ``,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Nyt Spil",
      cancelButtonText: "Gå Tilbage",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        incrementGameNumber();
        location.reload();
      } else {
      }
    });
};

// Usage:
const gameNumber = getGameNumber();
console.log(`Current game number: ${gameNumber}`);

//End Game Function - Updates the yearly points for each player
const endGame = async () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-success",
    },
    buttonsStyling: true,
  });
  swalWithBootstrapButtons
    .fire({
      title: `<br><h5>Dette vil <br><b style='color:red;'>afslutte dagens dartsession </b><br>& <br><b>Opdatere point <br> </b> til jeres årlige points udfra dagens points & gemme spillet i historik</h5></h5>`,
      text: ``,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Afslut Session",
      cancelButtonText: "Gå Tilbage",
      reverseButtons: true,
    })
    .then(async (result) => {
      // Add async here
      if (result.isConfirmed) {
        await playerService.updateYearlyPointsBasedOnRank();
        // Fetch the updated players data from the server
        const updatedPlayers = await playerService.getPlayers();
        // Update the local players array
        players.value = updatedPlayers;

        Swal.fire({
          position: "middle",
          icon: "success",
          title: `<h1 style='margin-bottom: .8em; font-size: 2.3rem;'>Spillet er gemt <br> Se historik</h1>`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
      }
    });
};

function openMenu() {
  document.querySelector(".menu").classList.toggle("active");
}
function closeMenu() {
  document.querySelector(".menu").classList.remove("active");
}

// Define the variables and functions to expose
defineExpose({
  filteredPlayers,
});

const getActivePlayerIndex = () => {
  const activePlayerDiv = document.querySelector(".activePlayer");
  const allPlayerDivs = Array.from(document.querySelectorAll(".player"));
  return allPlayerDivs.indexOf(activePlayerDiv);
};
const checkAll = () => {
  console.log("checkAll function called");
  const activePlayerDiv = document.querySelector(".activePlayer");
  console.log("activePlayerDiv:", activePlayerDiv);
  if (activePlayerDiv) {
    const activePlayerIndex = getActivePlayerIndex();
    checkAllCheckFieldsForPlayer(activePlayerDiv);
    checkScored(activePlayerIndex);
    document.querySelector(".activePlayer .checkAll").remove();
    /* nextPlayer(activePlayerIndex); */
  } else {
    console.log("No active player found");
  }
};

const checkAllCheckFieldsForPlayer = (playerDiv) => {
  console.log("checkAllCheckFieldsForPlayer called for:", playerDiv);
  const checkboxes = playerDiv.querySelectorAll(".check input");
  console.log("checkboxes:", checkboxes);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
};
</script>

<style>
.playersTable {
  display: flex;
  flex-wrap: wrap;
}
.player {
  height: fit-content;
}
.player span {
  border: 2px solid black;
  width: fit-content;
  min-width: 4em;
  min-height: 1em;
}

.check {
  padding: 0.5em 0;
  min-width: 13.7em !important;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.player {
  transition: 0.2s;
  position: relative;
  pointer-events: none;
}
.player span:nth-child(even) {
  background-color: #992b2e;
}
.player span:nth-child(odd) {
  background-color: #1aa864;
}
.player button {
  opacity: 0;
  transition: 0.5s;
}
.empty {
  background-color: #252424 !important;
}
.gameInfo {
  padding: 2em 0;
}
.gameInfo h2 {
  margin: 0;
  margin-bottom: 1.5rem;
}
.pointGrid {
  background: #25242455;
  margin-bottom: 0.5em;
  display: block;
  border: 20px black;
}
.pointGrid h2 {
  margin: 0;
  padding: 0.2em 0;
}
.pointGrid h2 {
  text-align: center;
}

.menu {
  display: none;
}
.active {
  position: fixed;
  display: grid;
  place-content: center;
  z-index: 99;
  inset: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.849);
}
.menu button {
  width: 13em;
  height: 3em;
  font-size: 1.8em;
  padding: 10px;
  position: relative;
  border: 2px solid rgb(31, 29, 29);
  color: #fbfbfb;
  margin: 1em 0;
}
.menu button::after {
  content: "";
  position: absolute;
  bottom: -1em;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #e9e2e2;
}
</style>
