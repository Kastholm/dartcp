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
      <div v-for="(gameRounds, player) in group" :key="player">
        <h2>{{ player }}</h2>
        <div v-for="(gameRound, roundIndex) in gameRounds" :key="roundIndex">
          <h3>Game {{ gameRound.gameRound }}</h3>
          <div style="background: green; padding: 3em">
            <h3>Navn {{ player.name }}</h3>
            <h3>Runder brugt {{ gameRound.dartRounds }}</h3>
            <h3>Plads {{ gameRound.placement }}</h3>
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
      grouped[dateKey] = {};
    }
    game.gameRounds.forEach((gameRound) => {
      const playerName = gameRound.name;
      if (!grouped[dateKey][playerName]) {
        grouped[dateKey][playerName] = [];
      }
      grouped[dateKey][playerName].push(gameRound);
    });
  });
  return grouped;
});
</script>

<style>
@import "@/assets/css/sweetAlert.css";
</style>
