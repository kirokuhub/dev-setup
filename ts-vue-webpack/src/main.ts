import { createApp } from "vue";

import App from "./App.vue";
import "@/assets/fonts/font.css";
import store from "./store/index";
import router from "@/router/index";

const { core: pinia } = store;

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
