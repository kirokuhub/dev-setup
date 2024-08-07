import { createRouter, createWebHashHistory } from "vue-router";

const files = import.meta.glob("./modules/*.ts", { eager: true });
const modules = Object.values(files)
  .map((item: any) => item.default)
  .flat();
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layout/index.vue"),
      children: modules,
      redirect: "/home",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login/index.vue"),
      meta: {
        title: "login page",
      },
    },
  ],
});

export default router;
