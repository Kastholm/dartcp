<template>
  <!-- RightPanel filteredPlayers activePlayer -->
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
        <button @click="startGame()" class="start" style="background: #024d02">
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
</template>

<script setup>
// Import the required dependencies
//Importing sweetalert2
import Swal from "sweetalert2";
// importing historyService from composable
import historyService from "@/composables/historyComposable.js";
// importing playerService from composable
import playerService from "@/composables/playersComposable.js";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, computed, defineEmits, defineProps } from "vue";
// ref players array to store players from the server
const players = ref([]);
// Game data that should be added to history log
let allGameData = [];
// Mount players from the server
onMounted(async () => {
  // Getting players from the server
  players.value = await playerService.getPlayers();
});

// Set gameStarted to false by default because the game hasn't started yet
const gameStarted = ref(false);

const emit = defineEmits(["startGame"]);
// When you click on Start game button, set active player to 0 (first player)
function startGame() {
  // Exits Menu
  document.querySelector(".menu").classList.remove("active");
  // Set gameStarted to true
  gameStarted.value = true;
  //Send information to the other files that the game has started
  emit("startGame");
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
function incrementGameNumber() {
  const currentGameNumber = getGameNumber();
  setGameNumber(currentGameNumber + 1);
}

const setGameNumber = (gameNumber) => {
  const gameInfo = {
    gameNumber: gameNumber,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
};

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

const props = defineProps({
  filteredPlayers: Array,
  activePlayer: Object,
  gameStarted: Boolean,
  round: Number,
  gameNumber: Number,
  activePlayerIndex: Number,
});
</script>

<style>
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
