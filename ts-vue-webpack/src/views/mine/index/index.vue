<template>
  <div class="mine-wrapper">
    <div class="title">Mine页面</div>
    <button class="button" @click="goToHome">前往index首页</button>

    <div style="padding: 10px; border: 1px solid #ff0000">
      <div>Received Value:</div>
      <div>{{ token }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, Router } from "vue-router";
import store from "@/store";
import { IStoreSetup } from "@/store";

const { useCommonStore } = store;
const commonStore: IStoreSetup = useCommonStore();

const token = computed(() => commonStore.getToken());

const router: Router = useRouter();
function goToHome() {
  router.push("/");
}
</script>

<style lang="less" scoped>
.mine-wrapper {
  .title {
    color: #ff0000;
  }

  .button {
    padding: 10px;
  }
}
</style>
