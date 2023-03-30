<template>
  <!-- RightPanel -->
  <section>
    <h1>HAALALAL</h1>
    <div
      class="rightPanel"
      v-for="player in PlayerTable.filteredPlayers"
      :key="player._id"
    >
      <div class="rightPanelBody">
        <div v-if="gameStarted" class="gameInfo">
          <h2 class="currentPlayer">
            Spiller:<br /><b>{{ activePlayer ? activePlayer.name : "" }}</b>
          </h2>
          <h2 class="pointIndicator">
            Dagens Point:<br /><b>{{
              activePlayer ? activePlayer.dailyPoints : ""
            }}</b>
          </h2>
          <h2 class="pointIndicator">
            Årlige Point:<br /><b>{{
              activePlayer ? activePlayer.yearlyPoints : ""
            }}</b>
          </h2>
          <br />
          <h2 class="round">
            Runde: <br /><b>
              {{ round }}
            </b>
          </h2>
          <h2 class="round">
            Spil: <br /><b>
              {{ gameNumber }}
            </b>
          </h2>
        </div>
        <div v-else class="gameInfo">
          <h1>Dagens Point</h1>
          <span
            class="pointGrid"
            v-for="(player, index) in PlayerTable.players"
            :key="player._id"
          >
            <h2 class="currentPlayer">
              <b>{{ player.name }}</b>
            </h2>
            <span>
              <h2 class="pointIndicator"><br />{{ player.dailyPoints }}</h2>
              <!-- <h2 class="pointIndicator">
                    Årets Point <br />{{ player.yearlyPoints }}
                  </h2> -->
            </span>
          </span>
        </div>
      </div>
      <button
        @click="openMenu()"
        class="start"
        style="background: #024d02; color: #fbfbfb; font-size: 1.4rem"
      >
        Menu<i class="fa-solid fa-arrows-rotate"></i>
      </button>
    </div>
    <div class="menu">
      <div class="buttons">
        <router-link to="/history"
          ><button class="log" style="background: #433010">
            Spil Historik
          </button></router-link
        >
        <div class="playerIndex">
          <button class="highScore" style="background: blue">
            highscore spil<i class="fa-solid fa-user-minus"></i>
          </button>
        </div>

        <div class="gameProgress">
          <button
            @click="startGame()"
            class="start"
            style="background: #024d02"
          >
            Start Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button
            @click="restartGame"
            class="restart"
            style="background: #540c0c"
          >
            Genstart Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button @click="endGame" class="restart" style="background: #050554">
            Gem Spil<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
        <div>
          <button @click="openMenu()" class="start" style="background: #024d02">
            Luk Menu<i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import playerService from "@/composables/playersComposable.js";

import * as PlayerTable from "@/components/playerTable.vue";
</script>

<style></style>
