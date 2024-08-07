import { Router } from "vue-router";

const guard = (router: Router): void => {
  router.beforeEach((to, from, next) => {
    next();
  });
};

export default guard;
