<template>
  <div class="main" v-if="board && players">
    <template v-if="board.team1.top">
      <img src="@/assets/images/top-square.svg" id="top-box" class="box" />

      <preview
        id="top-image"
        class="image rounded-3"
        :style="`opacity:${parseInt(board.opacity) / 100}`"
        :width="260"
        :height="260"
        :image="players[board.team1.top].image"
        :coordinates="players[board.team1.top].coordinates"
      />
    </template>

    <template v-if="board.team1.bottom">
      <img
        src="@/assets/images/bottom-square.svg"
        id="bottom-box"
        class="box"
      />
      <preview
        id="bottom-image"
        class="image rounded-3"
        :style="`opacity:${parseInt(board.opacity) / 100}`"
        :width="260"
        :height="260"
        :image="players[board.team1.bottom].image"
        :coordinates="players[board.team1.bottom].coordinates"
      />
    </template>

    <template v-if="board.team2.right">
      <img src="@/assets/images/right-square.svg" id="right-box" class="box" />
      <preview
        id="right-image"
        class="image rounded-3"
        :style="`opacity:${parseInt(board.opacity) / 100}`"
        :width="260"
        :height="260"
        :image="players[board.team2.right].image"
        :coordinates="players[board.team2.right].coordinates"
      />
    </template>

    <template v-if="board.team2.left">
      <img src="@/assets/images/left-square.svg" id="left-box" class="box" />
      <preview
        id="left-image"
        class="image rounded-3"
        :style="`opacity:${parseInt(board.opacity) / 100}`"
        :width="260"
        :height="260"
        :image="players[board.team2.left].image"
        :coordinates="players[board.team2.left].coordinates"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Preview } from "vue-advanced-cropper";
import { onBeforeMount } from "vue";
import getDocument from "@/composables/getDocument";
import getCollection from "@/composables/getCollectionAsDictionary";

const { error: boardError, doc: board, getDoc } = getDocument("board");
const { error: loadingPlayersError, documents: players } =
  getCollection("players");
const ENV = "prod";

onBeforeMount(async () => {
  await getDoc(ENV);
});
</script>

<style scoped>
.main {
  background-color: rgba(0, 0, 0, 0) !important;
  background-image: none !important;
  height: var(--screen-height);
  width: var(--screen-width);
  position: relative;
}

.image {
  position: absolute;
}
.box {
  position: absolute;
  height: var(--box-height);
  width: var(--box-width);
  z-index: 1;
}
#top-box {
  top: var(--box-top-bottom-margin);
  left: calc((var(--screen-width) / 2) - (var(--box-width) / 2));
}
#top-image {
  top: calc(var(--box-top-bottom-margin) + 13px);
  left: calc((var(--screen-width) / 2) - (var(--box-width) / 2) + 13px);
}

#bottom-box {
  bottom: var(--box-top-bottom-margin);
  left: calc((var(--screen-width) / 2) - (var(--box-width) / 2));
  transform: rotate(180deg);
}
#bottom-image {
  bottom: calc(var(--box-top-bottom-margin) + 13px);
  left: calc((var(--screen-width) / 2) - (var(--box-width) / 2) + 13px);
}

#left-box {
  top: calc((var(--screen-height) / 2) - (var(--box-height) / 2));
  left: 0px;
  transform: rotate(180deg);
}
#left-image {
  top: calc((var(--screen-height) / 2) - (var(--box-height) / 2) + 13px);
  left: 13px;
}

#right-box {
  top: calc((var(--screen-height) / 2) - (var(--box-height) / 2));
  right: 0px;
}
#right-image {
  top: calc((var(--screen-height) / 2) - (var(--box-height) / 2) + 13px);
  right: 13px;
}
</style>