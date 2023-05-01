<template>
  <div class="card m-4" v-if="sponcer && sponcer !== -1">
    <div class="card-header">
      تحديث بيانات الممول
      <span class="mark">{{ sponcer.name }}
        <span v-if="inBoard && inBoard.inBoard" class="mark">
          <i :class="`bi ${icons[inBoard.direction]} d-inline-block`"></i>
        </span>
      </span>
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-around align-items-end mb-3">
        <label for="name" class="form-label d-inline-block">اسم الممول</label>
        <input type="text" class="form-control d-inline-block w-75" id="name" v-model="sponcer.name" />
      </div>

      <cropper ref="cropperElm" class="cropper" :src="sponcer.image.src" :debounce="false" :stencil-props="{
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
      <router-link class="btn btn-outline-secondary" :to="{ name: 'all-sponcers' }">الغاء التحديث</router-link>
    </div>
  </div>
  <div v-if="sponcer === -1">
    <h3 class="m-3">Oops! :( sponcer Not Found.</h3>
  </div>
  <div v-if="!sponcer">
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

const sponcer = computed(() => {
  if (props.sponcers) {
    return props.sponcers.hasOwnProperty(props.id)
      ? props.sponcers[props.id]
      : -1;
  } else {
    return null;
  }
});
const inBoard = computed(() => {
  if (props.board?.team1.sponcer === props.id) {
    return { inBoard: true, direction: "right" };
  } else if (props.board?.team2.sponcer === props.id) {
    return { inBoard: true, direction: "left" };
  } else return { inBoard: false };
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
} = useDocument("sponcers");

const handleUpdate = async () => {
  const { coordinates } = cropperElm.value.getResult();
  await updateDoc(props.id, {
    coordinates: coordinates,
    name: sponcer.value.name,
  });
  if (!updateDataError.value) {
    router.push({ name: "all-sponcers" });
  }
};
</script>

<style>
.cropper {
  height: 25rem;
  background: #ddd;
}
</style>