export default {
  path: "/mine",
  name: "mine",
  component: () => import("@/views/mine/main.vue"),
  redirect: "/mine/index",
  meta: {
    keepAlive: false,
  },
  children: [
    {
      path: "/mine/index",
      name: "/mine/index",
      component: () => import("@/views/mine/index/index.vue"),
      meta: {
        keepAlive: false,
      },
    },
  ],
};
