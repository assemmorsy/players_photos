import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

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

projectAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount("#app");
  }
});
