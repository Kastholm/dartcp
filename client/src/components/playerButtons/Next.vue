<template>
  <button class="next" @click="nextPlayer(index)">Næste spiller</button>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits } from "vue";

import Swal from "sweetalert2";

//Modtager værdier fra parent
const props = defineProps({
  filteredPlayers: Array,
  round: Number,
  activePlayerIndex: Number,
  players: Array,
});
// Videregiver events til parent
const emit = defineEmits(["nextPlayer"]);

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
  //Send information to the other files that the game has started
  emit("nextPlayer", index);
}
/*  Swal.fire({
    position: "middle",
    icon: "success",
    title: `<h1 style='margin-bottom: .8em; font-size: 2.3rem;'>${nextPlayer.name}'s tur</h1><br><b style='font-size: 4rem;'></b>`,
    showConfirmButton: false,
    timer: 2000,
  }); */
</script>

<style></style>
