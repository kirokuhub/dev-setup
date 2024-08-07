import { ref } from "vue";
import { defineStore } from "pinia";
type IModifyCount = (count: number) => void;
const storeId = "counter";
function storeSetup() {
  const count = ref<number>(0);
  const modifyCount: IModifyCount = (newCount: number = 0) => {
    count.value = newCount;
  };
  return {
    count,
    modifyCount,
  };
}

const useCounterStore = defineStore(storeId, storeSetup);
export default useCounterStore;
