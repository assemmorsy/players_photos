<template>
    <div v-if="NashraStore.IsDataProvided" id="nashra-comp" class="position-relative text-center h-100 w-100">
        <component :is="COMPS[NashraStore.currentStateNames[0]]"></component>
    </div>
</template>
  
<script setup>
import { useNashraStore } from "@/stores/NashraStore.js"
import { onBeforeMount } from "vue"

import Score from "@/components/Nashra/Score.vue";
import DetailedScore from "@/components/Nashra/DetailedScore.vue";
import Winning from "@/components/Nashra/WinnerView.vue";
const COMPS = {
    score: Score,
    detailedScore: DetailedScore,
    winning: Winning,
}

const NashraStore = useNashraStore();

onBeforeMount(async () => {
    await NashraStore.startDataFetching()
})
</script>
  
<style scoped>
/* #nashra-comp {
    background-color: darkcyan;
} */
</style>
  