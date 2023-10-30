<template>
    <div class="main" v-if="board && players">
        <div v-if="board.team1.top" class="wrapper top-wrapper ">
            <img src="@/assets/images/BlackFrame.svg" id="top-box" class="box" />
            <preview id="top-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`" :width="268"
                :height="361" :image="players[board.team1.top].image" :coordinates="players[board.team1.top].coordinates" />
        </div>

        <div class="wrapper bottom-wrapper" v-if="board.team1.bottom">
            <img src="@/assets/images/BlackFrame.svg" id="bottom-box" class="box" />
            <preview id="bottom-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`"
                :width="268" :height="361" :image="players[board.team1.bottom].image"
                :coordinates="players[board.team1.bottom].coordinates" />
        </div>

        <div class="wrapper right-wrapper" v-if="board.team2.right">
            <img src="@/assets/images/RedFrame.svg" id="right-box" class="box" />
            <preview id="right-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`"
                :width="268" :height="361" :image="players[board.team2.right].image"
                :coordinates="players[board.team2.right].coordinates" />
        </div>

        <div class="wrapper left-wrapper" v-if="board.team2.left">
            <img src="@/assets/images/RedFrame.svg" id="left-box" class="box" />
            <preview id="left-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`"
                :width="268" :height="361" :image="players[board.team2.left].image"
                :coordinates="players[board.team2.left].coordinates" />
        </div>
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

.wrapper {
    position: absolute;
    height: var(--box-height);
    width: var(--box-width);
    overflow: hidden;
    border-radius: 40px;
}

.top-wrapper {
    bottom: var(--box-top-bottom-margin);
    left: var(--box-left-right-margin);
}

#top-box {
    top: 0;
    left: 0;
}

#top-image {
    top: 13px;
    left: 13px;
}

.bottom-wrapper {
    top: var(--box-top-bottom-margin);
    right: var(--box-left-right-margin);
}

#bottom-box {
    bottom: 0;
    left: 0;
}

#bottom-image {
    bottom: 13px;
    left: 13px;
}

.left-wrapper {
    bottom: var(--box-top-bottom-margin);
    right: var(--box-left-right-margin);
}

#left-box {
    top: 0px;
    left: 0px;
}

#left-image {
    top: 13px;
    left: 13px;
}

.right-wrapper {
    top: var(--box-top-bottom-margin);
    left: var(--box-left-right-margin);
}

#right-box {
    top: 0px;
    right: 0px;
}

#right-image {
    top: 13px;
    right: 13px;
}
</style>