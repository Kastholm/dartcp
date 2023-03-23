<script setup lang="ts">
import dartLoader from "@/assets/img/dartload.gif";
//Importing sweetalert2
import Swal from "sweetalert2";
//Importing ref and onMounted
import { ref, onMounted } from "vue";
//Importing the router
import { RouterLink, RouterView } from "vue-router";
//Panel for the right side of the dartboard with game info
import rightPanel from "../components/rightPanel.vue";
//Panel for numbers to the left of the dartboard
import numberPanel from "../components/numberPanel.vue";
//Player table
import playerTable from "../components/playerTable.vue";
//Importing playerService
import playerService from "@/composables/playersComposable.js";

const players = ref([]);
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

<template>
  <main class="dart-body">
    <!-- When players are loaded -->
    <section v-if="loading" class="loading-screen">
      <h2>Indlæser spil...</h2>
      <div><img :src="dartLoader" alt="" /></div>
    </section>
    <!-- When players are loading -->
    <numberPanel />
    <playerTable />
  </main>
</template>

<style>
@import "@/assets/css/main.css";
@import "@/assets/css/loadingScreen.css";
@import "@/assets/css/sweetAlert.css";
.dart-body {
  display: flex;
  flex-wrap: nowrap;
  transition: 0.2s;
  padding: 0em;
  color: #fbfbfb;
  max-width: 1640px;
}
main {
  height: 100vh;
  width: 100vw;
  background-image: url("@/assets/img/background.jpg");
  background-size: cover;
  background-position: center;
}
</style>
