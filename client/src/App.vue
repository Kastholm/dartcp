<script setup lang="ts">
//Importing ref and onMounted
import { ref, onMounted } from "vue";
//Importing the router
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main class="dart-body">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <!-- When players are loaded -->
    <!--  <section v-if="loading" class="loading-screen">
      <h2>Indlæser spil...</h2>
      <div><img :src="dartLoader" alt="" /></div>
    </section> -->
    <!-- When players are loading -->
    <!-- <numberPanel />
    <playerTable /> -->
  </main>
</template>

<style></style>
