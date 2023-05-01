<template>
  <div class="card m-4" v-if="player && player !== -1">
    <div class="card-header">
      تحديث بيانات اللاعب
      <span class="mark">{{ player.name }}
        <span v-if="inBoard && inBoard.inBoard" class="mark">
          <i :class="`bi ${icons[inBoard.direction]} d-inline-block`"></i>
        </span>
      </span>
    </div>
    <div class="card-body">
      <div class="mb-3 d-flex justify-content-around align-items-end">
        <label for="name" class="form-label d-inline-block">اسم الاعب </label>
        <input type="text" class="form-control d-inline-block w-75" id="name" v-model="player.name" />
      </div>

      <cropper ref="cropperElm" class="cropper" :src="player.image.src" :debounce="false" :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
      }" :stencil-size="{
  width: 257,
  height: 257,
}" image-restriction="stencil" />
    </div>
    <div class="card-footer">
      <button class="btn btn-warning me-2" :disabled="updateDataloading" @click.prevent="handleUpdate">
        تحديث
        <span v-if="updateDataloading" class="spinner-border spinner-border-sm ms-3" role="status"
          aria-hidden="true"></span>
      </button>
      <router-link class="btn btn-outline-secondary" :to="{ name: 'all-players' }">الغاء التحديث</router-link>
    </div>
  </div>
  <div v-if="player === -1">
    <h3 class="m-3">Oops! :( Player Not Found.</h3>
  </div>
  <div v-if="!player">
    <h3 class="m-3 lead">Loading</h3>
  </div>
  <div class="text-danger">
    <p>{{ updateDataError }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Cropper } from "vue-advanced-cropper";
import { useRouter } from "vue-router";
import useDocument from "@/composables/useDocument";
const props = defineProps(["players", "sponcers", "board", "ENV", "records", "id"]);
const cropperElm = ref(null);
const router = useRouter();

const player = computed(() => {
  if (props.players) {
    return props.players.hasOwnProperty(props.id)
      ? props.players[props.id]
      : -1;
  } else {
    return null;
  }
});
const inBoard = computed(() => {
  if (props.board?.team1.top === props.id)
    return { inBoard: true, direction: "top" };
  else if (props.board?.team1.bottom === props.id)
    return { inBoard: true, direction: "bottom" };
  else if (props.board?.team2.left === props.id)
    return { inBoard: true, direction: "left" };
  else if (props.board?.team2.right === props.id)
    return { inBoard: true, direction: "right" };
  else return { inBoard: false };
});

const icons = {
  top: "bi-arrow-up-circle",
  bottom: "bi-arrow-down-circle",
  left: "bi-arrow-left-circle",
  right: "bi-arrow-right-circle",
};

const {
  error: updateDataError,
  isPending: updateDataloading,
  updateDoc,
} = useDocument("players");

const handleUpdate = async () => {
  const { coordinates } = cropperElm.value.getResult();
  await updateDoc(props.id, {
    coordinates: coordinates,
    name: player.value.name,
  });
  if (!updateDataError.value) {
    router.push({ name: "all-players" });
  }
};
</script>

<style>
.cropper {
  height: 25rem;
  background: #ddd;
}
</style>