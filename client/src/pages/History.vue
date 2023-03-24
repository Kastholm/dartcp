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

    <div style="text-align: center">
      <h2>Game History</h2>
      <div v-for="(game, index) in history" :key="index">
        <h1>{{ game.name }}</h1>
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
          <div
            style="background: green; padding: 3em"
            v-for="(dartRound, dartIndex) in gameRound.dartRounds"
            :key="dartIndex"
          >
            <h3>Navn {{ dartRound.player }}</h3>
            <h3>Runder brugt {{ dartRound.roundsTaken }}</h3>
            <h3>Plads {{ dartRound.placement }}</h3>
          </div>
        </div>
      </div>
    </div>

    <router-link to="/"><h1>klik</h1></router-link>
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
</script>

<style>
@import "@/assets/css/sweetAlert.css";
</style>
