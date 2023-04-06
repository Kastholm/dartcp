<template>
  <div class="playersTable">
    <!-- Looping through players in playerbase and filtering them by dailyscore -->
    <div
      class="player"
      v-for="(player, index) in filteredPlayers"
      :key="player._id"
      :class="{ activePlayer: index === activePlayerIndex }"
    >
      <!-- Adding player name to table -->
      <span class="empty">
        <input class="playerName" :value="player.name" />
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
        <NextButton
          @nextPlayer="nextPlayer"
          :players="players"
          :round="round"
          :activePlayerIndex="activePlayerIndex"
          :filteredPlayers="filteredPlayers"
        />
        <button class="next checkAll" @click="checkAll()">check all</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits } from "vue";
import NextButton from "@/components/playerButtons/Next.vue";
//Modtager værdier fra parent
const props = defineProps({
  //Data modtaget fra parent PlayerTable.vue
  filteredPlayers: Array,
  activePlayer: Object,
  gameStarted: Boolean,
  round: Number,
  players: Array,
  gameNumber: Number,
  activePlayerIndex: Number,
  getGameNumber: Function,
  checkScored: Function, // declare checkScored as a prop
  checkAll: Function, // declare checkAll as a prop

  //Data modtaget fra children Next.vue
  nextPlayer: Function, // declare nextPlayer as a prop
});
// Videregiver information og funktioner til children
defineExpose({
  filteredPlayers: Array,
  round: Number,
  activePlayerIndex: Number,
  players: Array,
});
// Videregiver events til parents
const emits = defineEmits({
  checkScored: (index, boxes) => ({ index, boxes }),
  checkAll: () => {},
  /* nextPlayer: (index) => ({ index }), */
});

function checkScored(index, boxes) {
  // emit the checkScored event to PlayerTable.vue
  emits("checkScored", index, boxes);
}

function checkAll() {
  // emit the checkAll event to PlayerTable.vue
  emits("checkAll");
}
/* function nextPlayer(index) {
  // emit the checkAll event to PlayerTable.vue
  emits("nextPlayer", index);
} */
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
</style>
