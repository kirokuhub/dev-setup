import { ref } from "vue";
import { defineStore } from "pinia";
import FINAL from "@/constants";

const storeId: string = FINAL.PINIA.STORE_NAME_COMMON;

export interface IStoreSetup {
  getToken: () => string;
  setToken: (string) => void;
}

const storeSetup = (): IStoreSetup => {
  const token = ref<string>("");

  const getToken = (): string => {
    return token.value;
  };

  const setToken = (value: string) => {
    token.value = value;
  };

  return {
    getToken,
    setToken,
  };
};

export default defineStore<string, IStoreSetup>(storeId, storeSetup);
