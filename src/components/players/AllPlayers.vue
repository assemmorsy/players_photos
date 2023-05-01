<template>
  <div class="players m-3">
    <div class="
        mb-2
        d-flex
        flex-row
        justify-content-center
        align-items-center
        flex-column flex-md-row
      ">
      <div class="d-inline-block">
        <label for="search" class="form-label d-inline-block me-2 fs-3">بحث</label>
        <input type="text" v-model="search" class="form-control d-inline-block" id="search" placeholder="كلمة البحث"
          style="width: 70%" />
      </div>

      <router-link :to="{ name: 'add-player' }" class="btn btn-primary mt-2">اضافة لاعب</router-link>
    </div>
    <p class="bg-warning p-1 rounded mb-1" style="font-size: 0.9rem">
      <i class="bi bi-exclamation-triangle p-1"></i>
      لحذف اي لاعب يمكنك الضفط علي

      <span class="py-0 px-1 rounded" style="background-color: #ddd">
        Ctrl +
        <i class="bi bi-trash3 text-danger p-0 m-0"></i>
      </span>
    </p>
    <p class="bg-warning p-1 rounded mt-1" style="font-size: 0.9rem">
      <i class="bi bi-exclamation-triangle p-1"></i>
      لحذف اي لاعب بالرجاء التأكد من انه غير موجود في البورد لإتاحة حذفه
    </p>
    <div v-if="filteredPlayers" class="grid text-center overflow-scroll" style="height: 50vh">
      <template v-for="player in filteredPlayers" :key="player.id">
        <PlayerCard :player="player" :inBoard="ckeckInBoard(player.id)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import PlayerCard from "./PlayerCard.vue";
import { ref, computed } from "vue";
const props = defineProps(["players", "sponcers", "board", "ENV", "records"]);
const search = ref("");
const filteredPlayers = computed(() => {
  let result = [];
  if (props.players) {
    for (let playerId in props.players) {
      if (
        props.players[playerId].name
          .toLowerCase()
          .includes(search.value.toLowerCase())
      ) {
        result.push(props.players[playerId]);
      }
    }
    return result;
  } else {
    return null;
  }
});
const ckeckInBoard = (id) => {
  if (props.board?.team1.top === id) return { inBoard: true, direction: "top" };
  else if (props.board?.team1.bottom === id)
    return { inBoard: true, direction: "bottom" };
  else if (props.board?.team2.left === id)
    return { inBoard: true, direction: "left" };
  else if (props.board?.team2.right === id)
    return { inBoard: true, direction: "right" };
  else return { inBoard: false };
};
</script>

<style>

</style>