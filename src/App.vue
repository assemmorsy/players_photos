<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style >
:root {
  --screen-height: 2160px;
  --screen-width: 3840px;
  --box-height: 361px;
  --box-width: 268px;
  --box-top-bottom-margin: 60px;
  --box-left-right-margin: 305px;

  --winner-box-size: 200px;

  --score-radius: 7rem;
  --score-margin: 1.2rem;
  --score-height: 4.9rem;
  --score-width: 17rem;
  --score-overlap: 3rem;
  --score-margin-x: 3rem;

  --detail-radius: 8.5rem;
  --detail-header-width: 30rem;
  --detail-header-height: 5rem;
}

body {

  background-color: #0000 !important;
  overflow: hidden !important;
}
</style>
