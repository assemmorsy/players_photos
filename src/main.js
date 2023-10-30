import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import { createPinia } from 'pinia'

import { projectAuth } from "@/firebase/config";

import "bootstrap";
// css imports
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue-select/dist/vue-select.css";
import "@/assets/css/fonts.css";

let app;
const pinia = createPinia()

projectAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(pinia)
    app.mount("#app");
  }
});
