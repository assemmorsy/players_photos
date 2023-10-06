<template>
    <div class="main" v-if="board && players">


        <template v-if="board.team2.left">
            <img src="@/assets/images/left-square.svg" id="left-box" class="box" />
            <preview id="left-image" class="image rounded-3" :style="`opacity:${parseInt(board.opacity) / 100}`"
                :width="260" :height="260" :image="players[board.team2.left].image"
                :coordinates="players[board.team2.left].coordinates" />
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


#left-box {
    top: calc((var(--screen-height) / 2) - (var(--box-height) / 2));
    left: 0px;
    transform: rotate(180deg);
}

#left-image {
    top: calc((var(--screen-height) / 2) - (var(--box-height) / 2) + 13px);
    left: 13px;
}
</style>