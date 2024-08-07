<script setup lang="ts">
import { computed } from "vue";
import { useRouter, Router } from "vue-router";
import { showToast } from "vant";
import store from "@/store";
import api from "@/api/index";

import { IStoreSetup } from "@/store";

import "vant/es/toast/style";
import "vant/es/button/style";

const { useCommonStore } = store;
const commonStore: IStoreSetup = useCommonStore();

const router: Router = useRouter();

const token = computed<string>(() => commonStore.getToken());

function goToHome(): void {
  router.push("/mine");
}

function assign() {
  const timestamp = new Date().getTime();
  const val = `value from index pageview: ${timestamp}`;
  commonStore.setToken(val);
}

function invokeToast() {
  showToast("Some messages");
}

async function retrieve() {
  const val = await api.common.queryTime();
  console.log("val");
  console.log(val);
  console.log("\n");
}
</script>

<template>
  <div class="index-wrapper">
    <div class="title">index页面</div>
    <button class="button" @click="goToHome">前往Mine页面</button>

    <div style="padding: 10px; border: 1px solid #ff0000">
      <button @click="assign">对commonStore赋值</button>
      <div>{{ token }}</div>
    </div>

    <div style="padding: 10px; border: 1px solid #ff0000">
      <van-button type="primary" class="button" @click="goToHome"
        >前往Mine页面</van-button
      >

      <van-button @click="invokeToast">showToast</van-button>
    </div>

    <div style="padding: 10px; border: 1px solid #ff0000">
      <div class="square">Square</div>
    </div>

    <div style="margin-top: 10px; padding: 10px; border: 1px solid #ff0000">
      <van-button type="primary" @click="retrieve">request</van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.index-wrapper {
  .title {
    color: #00ffff;
  }

  .button {
    padding: 10px;
  }

  .square {
    width: 200px;
    height: 200px;
    background-color: #00ff00;
  }
}
</style>
