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
  --box-height: 287px;
  --box-width: 287px;
  --box-top-bottom-margin: 24px;

  --winner-box-size: 200px;

  --score-radius: 7rem;
  --score-margin: 3.5rem;
  --score-height: 4.9rem;
  --score-width: 17rem;
  --score-overlap: 3rem;
  --score-margin-x: 3rem;

  --detail-radius: 8.5rem;
  --detail-header-width: 30rem;
  --detail-header-height: 5rem;
}
</style>
