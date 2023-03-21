<template>
  <div class="number">
    <span class="empty numb">Tal</span>
    <span class="count">20</span>
    <span class="count">19</span>
    <span class="count">18</span>
    <span class="count">17</span>
    <span class="count">16</span>
    <span class="count">15</span>
    <span class="count">14</span>
    <span class="count">13</span>
    <span class="count">T</span>
    <span class="count">D</span>
    <span class="count">B</span>
  </div>
</template>

<script>
export default {};
</script>

<style>
.number {
  height: fit-content;
  display: grid;
  width: fit-content;
  text-align: center;
}
.number span:nth-child(even) {
  background-color: #992b2e;
  font-family: mono45-headline, monospace;
  font-weight: 700;
  font-style: normal;
  font-size: 2.2rem;
  padding: 0.25em 0;
  min-width: 2em;
  width: fit-content;
}
.number span:nth-child(odd) {
  background-color: #1aa864;
  font-family: mono45-headline, monospace;
  font-weight: 700;
  font-style: normal;
  font-size: 2.2rem;
  padding: 0.25em 0;
  min-width: 2em;
  width: fit-content;
}
</style>
