export default {
  path: "/",
  component: () => import("@/views/index/main.vue"),
  redirect: "/index",
  meta: {
    keepAlive: false,
  },
  children: [
    {
      path: "/index",
      name: "/index",
      component: () => import("@/views/index/index/index.vue"),
      meta: {
        keepAlive: false,
      },
    },
  ],
};
