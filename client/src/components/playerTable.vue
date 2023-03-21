<template>
  <section>
    <div class="playersTable">
      <!-- Looping through players in playerbase and filtering them by dailyscore -->
      <div class="player" v-for="player in filteredPlayers" :key="player._id">
        <!-- Adding player name to table -->
        <span class="empty"
          ><input class="playerName" :value="player.name" />
        </span>
        <!-- Adding 11 scoretables with a loop -->
        <span v-for="boxes in 11" :key="boxes" class="check">
          <input type="checkbox" /><input type="checkbox" /><input
            type="checkbox"
          />
        </span>
        <button class="next">Næste spiller</button>
      </div>
    </div>
    <!-- RightPanel -->
    <div class="rightPanel" v-for="player in players" :key="player._id">
      <div class="rightPanelBody">
        <div class="gameInfo">
          <h2 class="currentPlayer">{{ players[0].name }}</h2>
          <h2 class="pointIndicator">{{ players[0].dailyPoints }}</h2>
          <h2 class="pointIndicator">{{ players[0].yearlyPoints }}</h2>
          <br />
        </div>
        <h2 class="round">
          <b>Runde:</b> <br />
          0
        </h2>
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
import playerService from "@/composables/playersComposable.js";
import { ref, onMounted, watch } from "vue";

const players = ref([]);

onMounted(async () => {
  players.value = await playerService.getPlayers();
});

const filteredPlayers = ref([]);

watch(players, () => {
  filteredPlayers.value = players.value.sort(
    (a, b) => b.dailyPoints - a.dailyPoints
  );
});
</script>

<style>
.playersTable {
  display: flex;
  flex-wrap: nowrap;
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
</style>
