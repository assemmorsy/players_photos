<template>
    <div class="main" v-if="board && players">
        <template v-if="board.team1.top">
            <img src="@/assets/images/bottom-square.svg" id="top-box" class="box" />
            <preview id="top-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`" :width="260"
                :height="260" :image="players[board.team1.top].image" :coordinates="players[board.team1.top].coordinates" />
        </template>
    </div>
</template>
  
<script setup>
import { Preview } from "vue-advanced-cropper";
import { onBeforeMount } from "vue";
import getDocument from "@/composables/getDocument";
import getCollection from "@/composables/getCollectionAsDictionary";

const { doc: board, getDoc } = getDocument("board");
const { documents: players } =
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
    transform: rotate(180deg);

}

#top-image {
    top: calc(var(--box-top-bottom-margin) + 13px);
    left: calc((var(--screen-width) / 2) - (var(--box-width) / 2) + 13px);
}
</style>