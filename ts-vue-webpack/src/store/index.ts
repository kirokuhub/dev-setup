import { createPinia, Pinia } from "pinia";

import useCommonStore from "./modules/common";

export * from "./modules/common";

const core: Pinia = createPinia();

export default {
  core,
  useCommonStore,
};
