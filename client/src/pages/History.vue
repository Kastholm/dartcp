<template>
  <div style="display: flex">
    <div class="highScores">
      <h1>Highscore</h1>
      <div
        class="highPlayer"
        v-for="(player, index) in sortedPlayers"
        :key="index"
      >
        <h2>{{ player.name }}</h2>
        <h2>{{ player.roundsTaken }}</h2>
      </div>
    </div>

    <router-link to="/"><h1>klik</h1></router-link>

    <!-- <div style="text-align: center">
      <h2>Game History</h2>
      <div v-for="(games, date) in groupedByDate">
        <h1>{{ date }}</h1>
        <div v-for="(game, index) in games" :key="index">
          <h2>{{ game.name }}</h2>
          <div
            style="
              background: red;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              grid-gap: 10px;
            "
            v-for="(gameRound, roundIndex) in game.gameRounds"
            :key="roundIndex"
          >
            <h3>Game {{ gameRound.gameRound }}</h3>
            <div style="background: green; padding: 3em">
              <h3>Navn {{ game.name }}</h3>
              <h3>Runder brugt {{ gameRound.dartRounds }}</h3>
              <h3>Plads {{ gameRound.placement }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div v-for="(group, date) in groupedByDate" :key="date">
      <h1>{{ date }}</h1>
      <div>
        <div
          v-for="(gameRounds, player) in group"
          :key="player"
          style="display: flex"
        >
          <div v-for="(gameRound, roundIndex) in gameRounds" :key="roundIndex">
            <h3>Game {{ gameRound.gameRound }}</h3>
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
                Runder brugt <br /><b>{{ gameRound.dartRounds }}</b>
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
</template>

<script setup>
import historyService from "@/composables/historyComposable.js";
import playerService from "@/composables/playersComposable.js";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, computed } from "vue";
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

const groupedByDate = computed(() => {
  const grouped = {};
  history.value.forEach((game) => {
    const dateKey = game.gameDate.toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = {};j
    }
    game.gameRounds.forEach((gameRound) => {
      const player = game.name;
      if (!grouped[dateKey][player]) {
        grouped[dateKey][player] = [];
      }
      grouped[dateKey][player].push(gameRound);
    });
  });
  return grouped;
});
</script>

<style>
@import "@/assets/css/sweetAlert.css";
</style>
