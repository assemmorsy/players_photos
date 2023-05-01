<template>
  <div class="d-flex flex-row justify-content-around align-items-end w-100">
    <i
      :class="`bi ${icon} d-inline-block ms-md-3`"
      style="font-size: 3rem; color: cadetblue"
    ></i>
    <div class="d-inline-block" style="width: 60%">
      <label class="form-label text-primary">{{ label }}</label>
      <v-select
        dir="ltr"
        :options="optionsArray"
        label="name"
        :reduce="(sponcer) => sponcer.id"
        v-model="board[team][model]"
      />
    </div>
    <div class="d-inline-block">
      <preview
        v-if="board[team][model]"
        :width="50"
        :height="50"
        :image="options[board[team][model]].image"
        :coordinates="options[board[team][model]].coordinates"
      />
    </div>
  </div>
</template>

<script setup>
import vSelect from "vue-select";
import { Preview } from "vue-advanced-cropper";

import { computed, ref } from "vue";
const props = defineProps([
  "label",
  "optionsArray",
  "board",
  "icon",
  "options",
  "team",
  "model",
]);
const dataModel = ref(null);
</script>

<style>
</style>