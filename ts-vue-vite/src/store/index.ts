import { createPinia } from "pinia";
import useCounterStore from "./modules/counter";

const core = createPinia();

export default {
  core,
  useCounterStore,
};
