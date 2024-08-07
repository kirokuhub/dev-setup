import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import pinia from "@/store/index";

const { core: store } = pinia;

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
