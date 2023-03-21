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
        <button class="next" @click="nextPlayer(index)">Næste spiller</button>
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
          <!-- <h2 class="pointIndicator">
            {{ activePlayer ? activePlayer.yearlyPoints : "" }}
          </h2> -->
          <br />
          <h2 class="round">
            <b
              >Runde: <br />
              {{ round }}
            </b>
          </h2>
        </div>
        <div v-else class="gameInfo">
          <span v-for="(player, index) in players" :key="player._id">
            <h2 class="currentPlayer">
              <b>{{ player.name }}</b>
            </h2>
            <span class="pointGrid">
              <h2 class="pointIndicator">
                Dagens Point <br />{{ player.dailyPoints }}
              </h2>
              <h2 class="pointIndicator">
                Årets Point <br />{{ player.yearlyPoints }}
              </h2>
            </span>
          </span>
        </div>

        <div class="buttons">
          <button class="log">Historik</button>
          <button class="info">Spil Info</button>
          <h3>__________________________</h3>
          <div class="playerIndex">
            <button class="highScore">
              highscore spil<i class="fa-solid fa-user-minus"></i>
            </button>
          </div>
          <h3 class="startButLine">__________________________</h3>
          <div class="gameProgress">
            <button @click="startGame()" class="start">
              Start Spil<i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="restart">
              Genstart Spil<i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import winnerImg from "@/assets/img/trophy.gif";
//Importing sweetalert2
import Swal from "sweetalert2";
// importing playerService from composable
import playerService from "@/composables/playersComposable.js";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, computed } from "vue";

// ref players array to store players from the server
const players = ref([]);
// Mount players from the server
onMounted(async () => {
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
// Set active player to -1 by default because there are no starting players yet
const activePlayerIndex = ref(-1);
// Set gameStarted to false by default because the game hasn't started yet
const gameStarted = ref(false);
// Set round to 0 by default
const round = ref(0);
// When you click on Start game button, set active player to 0 (first player)
function startGame() {
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
  // Increment the round if the active player index is 0
  if (nextPlayerIndex === 0) {
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
function checkScored(index) {
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
  if (allChecked) {
    playerDiv.classList.add("winPlayer");
    const playerName = playerDiv.querySelector(".playerName").value;
    Swal.fire(
      `<img src='${winnerImg}'><p class='winRespond'><b>Tillykke</b><b><br style='margin: .5em;'> ${playerName}!</b><br><br>i tog $1 pladsen<br><br>efter ${round.value} Runde </p>`,
      "",
      ""
    );
    celebrate();
    setTimeout(() => {
      celebrate();
    }, "1000");
  } else {
    playerDiv.classList.remove("winPlayer");
  }
}
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

.pointGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1em;
}
.pointGrid h2 {
  text-align: center;
  border: 2px solid white;
  padding: 0.5em;
}

.gameInfo {
  padding: 2em 0;
}
.gameInfo h2 {
  margin: 0;
  margin-bottom: 1.5rem;
}
</style>
