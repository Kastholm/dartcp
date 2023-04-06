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
    <RightPanel
      :filteredPlayers="filteredPlayers"
      :activePlayer="activePlayer"
      :gameStarted="gameStarted"
      :round="round"
      :activePlayerIndex="activePlayerIndex"
      @startGame="startGame"
    />
  </section>
</template>

<script setup>
/* import { getGameNumber } from "@/components/RightPanel.vue"; */
import RightPanel from "@/components/RightPanel.vue";

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
const setActivePlayer = (index) => {
  activePlayerIndex.value = index;
};
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
            gameRound: $options.getGameNumber(), // Retrieve the current game round using getGameNumber()
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
        gameRound: $options.getGameNumber(),
        dartRounds: round.value,
        placement: completedPlayers,
      },
    ],
  };
  historyService.addHistory(gameData).catch((error) => {
    console.error(error);
  });
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

const props = defineProps({
  activePlayerIndex: Number,
});
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
</style>
