<template>
  <div>
    <!-- When players are loaded -->
    <section v-if="loading" class="loading-screen">
      <h2>Indlæser historik...</h2>
      <div><img :src="dartLoader" alt="" /></div>
    </section>
    <div class="logBody">
      <div class="highScores">
        <h1>Highscore</h1>
        <div
          class="highPlayer"
          v-for="(player, index) in sortedPlayers"
          :key="index"
        >
          <h2>
            <b>{{ player.name }}</b>
          </h2>
          <h2>Runder: {{ player.roundsTaken }}</h2>
        </div>
      </div>

      <div class="gameLogsBody">
        <div
          class="gameLogs"
          v-for="(group, date) in groupedByDate"
          :key="date"
        >
          <button @click="toggleGames(date)">{{ date }}</button>
          <div class="gamesBody" v-show="visibleGames[date]">
            <div class="topInfoFixed">
              <h1>
                Historik fra <br /><b>{{ date }}</b>
              </h1>
              <button class="closeGameLog" @click="toggleGames(date)">
                Close
              </button>
            </div>
            <div
              style="height: fit-content"
              v-for="(gameRounds, gameIndex) in group"
              :key="gameIndex"
            >
              <div class="gameRow" style="display: flex">
                <div
                  v-for="([player, gameRound], playerIndex) in gameRounds"
                  :key="playerIndex"
                >
                  <h3>Spil nr: {{ gameRound.gameRound }}</h3>
                  <div
                    class="defaultPlace"
                    :class="{
                      firstPlace: gameRound.placement === 1,
                      secondPlace: gameRound.placement === 2,
                      thirdPlace: gameRound.placement === 3,
                      fourthPlace: gameRound.placement === 4,
                      fifthPlace: gameRound.placement === 5,
                    }"
                  >
                    <h3>
                      Navn <br /><b>{{ player }}</b>
                    </h3>
                    <h3>
                      Runder <br /><b>{{ gameRound.dartRounds }}</b>
                    </h3>
                    <h3>
                      Plads <br /><b>{{ gameRound.placement }}</b>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- RightPanel -->
      <div
        class="rightPanel rpHistory"
        v-for="player in filteredPlayers"
        :key="player._id"
      >
        <div class="rightPanelBody">
          <div class="gameInfo">
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
        <div class="rightPanelBody">
          <div class="gameInfo">
            <h1>Årets Point</h1>
            <span
              class="pointGrid"
              v-for="(player, index) in players"
              :key="player._id"
            >
              <h2 class="currentPlayer">
                <b>{{ player.name }}</b>
              </h2>
              <span>
                <h2 class="pointIndicator"><br />{{ player.yearlyPoints }}</h2>
                <!-- <h2 class="pointIndicator">
                  Årets Point <br />{{ player.yearlyPoints }}
                </h2> -->
              </span>
            </span>
          </div>
        </div>
      </div>
      <router-link to="/"
        ><button class="gameReturn">
          Gå tilbage til Dartspil
        </button></router-link
      >
    </div>
  </div>
</template>

<script setup>
import dartLoader from "@/assets/img/dartload.gif";
import historyService from "@/composables/historyComposable.js";
import playerService from "@/composables/playersComposable.js";
import filteredPlayers from "@/components/playerTable.vue";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, reactive, computed } from "vue";
const players = ref([]);
const history = ref([]);
// Mount players from the server
onMounted(async () => {
  // Getting history from the server
  history.value = await historyService.getHistory();
  // Getting players from the server
  players.value = await playerService.getPlayers();
});

const sortedPlayers = computed(() => {
  return players.value.slice().sort((a, b) => a.roundsTaken - b.roundsTaken);
});
// Watch players array and sort filteredPlayers by dailyPoints
watch(players, () => {
  filteredPlayers.value = players.value.sort(
    (a, b) => b.yearlyPoints - a.yearlyPoints
  );
});

// Watch players array and sort filteredPlayers by yearlyPoints
/* watch(players, () => {
  filteredPlayers.value = players.value.sort(
    (a, b) => b.yearlyPoints - a.yearlyPoints
  );
}); */
const groupedByDate = computed(() => {
  const grouped = {};
  history.value.forEach((game) => {
    const dateKey = game.gameDate.toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    const gameRoundsByPlayer = {};
    game.gameRounds.forEach((gameRound) => {
      const player = game.name;
      gameRoundsByPlayer[player] = gameRound;
    });

    const sortedPlayers = Object.entries(gameRoundsByPlayer).sort(
      ([, gameRoundA], [, gameRoundB]) => {
        return gameRoundA.placement - gameRoundB.placement;
      }
    );

    grouped[dateKey].push(sortedPlayers);
  });

  return grouped;
});

const visibleGames = reactive({});

const toggleGames = (date) => {
  visibleGames[date] = !visibleGames[date];
};

const loading = ref(true);

// Load players from the server
onMounted(async () => {
  try {
    players.value = await playerService.getPlayers();
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style>
@import "@/assets/css/sweetAlert.css";
</style>
