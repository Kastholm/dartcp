<template>
  <div>
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
  </div>
</template>

<script setup>
import playerService from "@/composables/playersComposable.js";
// importing ref, onMounted, watch, computed from vue
import { ref, onMounted, watch, computed } from "vue";

const players = ref([]);
// Mount players from the server
onMounted(async () => {
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
