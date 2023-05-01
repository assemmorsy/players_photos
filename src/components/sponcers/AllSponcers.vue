<template>
  <div class="players m-3">
    <div class="
        mb-3
        d-flex
        flex-row
        justify-content-center
        align-items-center
        flex-column flex-md-row
      ">
      <div class="d-inline-block">
        <label for="search" class="form-label d-inline-block me-2 fs-3">بحث</label>
        <input type="text" v-model="search" class="form-control d-inline-block" id="search"
          placeholder="الكلمة المفتاحية للبحث" style="width: 70%" />
      </div>

      <router-link :to="{ name: 'add-sponcer' }" class="btn btn-primary mt-2">اضافة ممول</router-link>
    </div>
    <p class="bg-warning p-1 rounded mb-1" style="font-size: 0.9rem">
      <i class="bi bi-exclamation-triangle p-1"></i>
      لحذف اي ممول يمكنك الضفط علي

      <span class="py-0 px-1 rounded" style="background-color: #ddd">
        Ctrl +
        <i class="bi bi-trash3 text-danger p-0 m-0"></i>
      </span>
    </p>
    <p class="bg-warning p-1 rounded mt-1" style="font-size: 0.9rem">
      <i class="bi bi-exclamation-triangle p-1"></i>

      لحذف اي ممول بالرجاء التأكد من انه غير موجود في البورد لإتاحة حذفه
    </p>
    <div v-if="filteredSponcers" class="grid text-center overflow-scroll" style="height: 50vh">
      <template v-for="sponcer in filteredSponcers" :key="sponcer.id">
        <SponcerCard :sponcer="sponcer" :inBoard="ckeckInBoard(sponcer.id)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import SponcerCard from "@/components/sponcers/SponcerCard.vue";
import { ref, computed } from "vue";
const props = defineProps(["players", "sponcers", "board", "ENV", "records"]);
const search = ref("");
const filteredSponcers = computed(() => {
  let result = [];
  if (props.sponcers) {
    for (let sponcerId in props.sponcers) {
      if (
        props.sponcers[sponcerId].name
          .toLowerCase()
          .includes(search.value.toLowerCase())
      ) {
        result.push(props.sponcers[sponcerId]);
      }
    }
    return result;
  } else {
    return null;
  }
});
const ckeckInBoard = (id) => {
  if (props.board?.team1.sponcer === id) {
    return { inBoard: true, direction: "right" };
  } else if (props.board?.team2.sponcer === id) {
    return { inBoard: true, direction: "left" };
  } else return { inBoard: false };
};
</script>

<style>

</style>