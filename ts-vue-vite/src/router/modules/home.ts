const router = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      title: "home page",
    },
  },
  {
    path: "/secondary",
    name: "secondary",
    component: () => import("@/pages/home/secondary.vue"),
    meta: {
      title: "secondary page",
    },
  },
];

export default router;
