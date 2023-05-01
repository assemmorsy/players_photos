<template>
  <div class="g-col-2 d-inline-block card m-1">
    <div class="card-header text-center m-0">
      <h5 class="card-title m-0">
        {{ sponcer.name }}
        <span v-if="inBoard.inBoard" class="mark py-0">
          <i :class="`bi ${icons[inBoard.direction]} d-inline-block `"></i>
        </span>
      </h5>
    </div>
    <div class="card-body d-flex justify-content-center">
      <preview
        :width="120"
        :height="120"
        :image="sponcer.image"
        :coordinates="sponcer.coordinates"
      />
      <div class="errors m-0 p-0" style="font-size: 0.8rem">
        <p class="text-danger m-0 p-0 mt-1">{{ deleteImageError }}</p>
        <p class="text-danger m-0 p-0 mt-1">{{ deleteDataError }}</p>
      </div>
    </div>
    <div class="card-footer p-1 text-center">
      <button
        class="btn btn-danger m-0 p-1 px-3"
        :disabled="deleteImageLoading || deleteDataLoading"
        @click.ctrl.prevent="handleDelete"
      >
        <i class="bi bi-trash3"></i>
        <span
          v-if="deleteImageLoading || deleteDataLoading"
          class="spinner-border spinner-border-sm ms-2"
          role="status"
          aria-hidden="true"
        ></span>
      </button>
      <router-link
        :to="{ name: 'update-sponcer', params: { id: sponcer.id } }"
        class="btn btn-warning ms-1 m-0 p-1 px-3"
        ><i class="bi bi-person-bounding-box"></i
      ></router-link>
    </div>
  </div>
</template>

<script setup>
import useDocument from "@/composables/useDocument";
import useStorage from "@/composables/useStorage";
import { Preview } from "vue-advanced-cropper";

const props = defineProps(["sponcer", "inBoard"]);

const {
  deleteImage,
  loading: deleteImageLoading,
  error: deleteImageError,
} = useStorage();

const {
  error: deleteDataError,
  isPending: deleteDataLoading,
  deleteDoc,
} = useDocument("sponcers");

const icons = {
  top: "bi-arrow-up-circle",
  bottom: "bi-arrow-down-circle",
  left: "bi-arrow-left-circle",
  right: "bi-arrow-right-circle",
};

const handleDelete = async () => {
  if (!props.inBoard.inBoard) {
    await deleteImage(props.sponcer.filePath);
    if (!deleteImageError.value) {
      await deleteDoc(props.sponcer.id);
    }
  }
};
</script>

<style>
</style>