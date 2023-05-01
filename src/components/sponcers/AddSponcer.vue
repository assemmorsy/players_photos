<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="m-3 d-flex justify-content-between align-items-end">
        <label for="name" class="form-label d-inline-block me-3">الاسم</label>
        <input type="text" class="form-control d-inline-block" name="name" id="name" placeholder="اسم الممول "
          v-model="sponcer.name" required />
      </div>
      <div class="m-3 d-flex justify-content-center align-items-center">
        <label for="image" class="form-label d-inline-block me-3" style="width: 19%">
          <i class="bi bi-image m-2"></i>الصورة</label>
        <input type="file" class="form-control d-inline-block" name="image" id="image" accept="image/*"
          @change="handleUploadImage" required />
        <button class="btn btn-danger ms-2 px-2" @click.prevent="removePhoto">
          <i class="bi bi-x-circle"></i>
        </button>
      </div>
      <div v-if="uploadedImage.url" class="mb-3 d-flex justify-content-center">
        <cropper ref="cropperELm" class="cropper" :src="uploadedImage.url" :debounce="false" :stencil-props="{
          handlers: {},
          movable: false,
          resizable: false,
        }" :stencil-size="{
  width: 257,
  height: 257,
}" image-restriction="stencil" />
      </div>

      <div class="Errors">
        <p class="text-danger">{{ uploadImageError }}</p>
        <p class="text-danger">{{ saveDataError }}</p>
        <p class="text-danger">{{ error }}</p>
      </div>

      <div class="actions">
        <button class="btn btn-primary px-5" :disabled="uploadImageloading || saveDataloading" type="submit">
          حفظ
          <span v-if="uploadImageloading || saveDataloading" class="spinner-border spinner-border-sm ms-3" role="status"
            aria-hidden="true"></span>
        </button>
        <router-link :to="{ name: 'all-sponcers' }" class="btn btn-outline-secondary ms-3 px-3">الغاء</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Cropper } from "vue-advanced-cropper";
import useStorage from "@/composables/useStorage.js";
import useCollection from "@/composables/useCollection.js";
import { timestamp } from "@/firebase/config";
import { useRouter } from "vue-router";
const {
  error: uploadImageError,
  loading: uploadImageloading,
  uploadFile,
  filePath,
  url,
} = useStorage();
const {
  error: saveDataError,
  loading: saveDataloading,
  addDoc,
} = useCollection("sponcers");
const router = useRouter();
const cropperELm = ref(null);
const error = ref(null);
const sponcer = ref({
  name: "",
  image: { src: null },
  coordinates: {},
});
const uploadedImage = ref({
  file: null,
  url: null,
});

const handleUploadImage = (e) => {
  if (e.target) {
    uploadedImage.value.file = e.target.files[0];
    uploadedImage.value.url = URL.createObjectURL(uploadedImage.value.file);
    error.value = null;
  }
};
const removePhoto = () => {
  uploadedImage.value.file = null;
  uploadedImage.value.url = null;
  error.value = "Please, choose an image file.";
};
const handleSubmit = async () => {
  if (cropperELm.value) {
    const { coordinates } = cropperELm.value.getResult();
    sponcer.value.coordinates = coordinates;
    const fileUploadRes = await uploadFile(
      sponcer.value.name,
      uploadedImage.value.file
    );
    if (!uploadImageError.value) {
      console.log("image uploaded successfuly.");
      sponcer.value.image.src = url.value;
      sponcer.value.filePath = filePath.value;
      const saveDataRes = await addDoc({
        ...sponcer.value,
        createdAt: timestamp(),
      });
      // console.log(saveDataRes.data);
      if (!saveDataError.value) {
        console.log("saved successfuly");
        router.push({ name: "all-sponcers" });
      }
    }
  } else {
    error.value = "Please, choose an image file.";
  }
};
</script>

<style>
.cropper {
  height: 25rem;
  background: #ddd;
}
</style>