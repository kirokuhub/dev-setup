import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import index from "./modules/index";
import mine from "./modules/mine";
import routerHelpers from "./helpers";

const mode = process.env.VUE_APP_ROUTER_MODE; // hash; history;
const history = mode === "hash" ? createWebHashHistory() : createWebHistory();
const routes = [index, mine];
const config = { history, routes };
const router = createRouter(config);
routerHelpers.guard(router);

export default router;
