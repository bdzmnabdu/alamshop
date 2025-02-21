import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/main.css";
import "primeicons/primeicons.css";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(VueQueryPlugin);
app.use(pinia);
app.use(router);
app.mount("#app");
