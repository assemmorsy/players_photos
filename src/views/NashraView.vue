<template>
    <div v-if="NashraStore.IsDataProvided" class="position-relative text-center h-100 w-100">
        <component :is="COMPS[NashraStore.currentStateNames[0]]"></component>
    </div>
</template>
  
<script setup>
import { useNashraStore } from "@/stores/NashraStore.js"
import { onBeforeMount } from "vue"

import Score from "@/components/Nashra/Score.vue";
import DetailedScore from "@/components/Nashra/DetailedScore.vue";
import Winning from "@/components/Nashra/WinnerView.vue";
console.log("from nashra view");
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
  
<style scoped></style>
  