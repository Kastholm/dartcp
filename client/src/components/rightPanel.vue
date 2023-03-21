<template>
  
</template>

<script setup>
import playerService from "@/composables/playersComposable.js";
import { ref, onMounted } from "vue";

const players = ref([]);

onMounted(async () => {
  players.value = await playerService.getPlayers();
});
</script>

<style></style>
