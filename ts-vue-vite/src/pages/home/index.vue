<script setup lang="ts">
import store from "@/store";

const { useCounterStore } = store;
const counterStore = useCounterStore();
const router = useRouter();
const times = ref<number>(0);
function navToLogin() {
  router.push({ path: "/login", query: {} });
}
function navToSecondary() {
  router.push({ path: "/secondary", query: {} });
}
function handleCount(newVal: number = 0) {
  counterStore.modifyCount(counterStore.count + newVal);
}
function tapButton() {
  times.value += 1;
}
</script>

<template>
  <div class="home">
    <p>homepage</p>
    <button @click="navToLogin">navToLogin</button>
    <p>secondary page</p>
    <button @click="navToSecondary">navToSecondary</button>
    <br />
    <p>counter: {{ counterStore.count }}</p>
    <div class="button-group">
      <van-button type="primary" @click="handleCount(1)"> Add </van-button>
      <van-button type="primary" @click="handleCount(-1)"> Minus </van-button>
    </div>
    <br />
    <van-button @click="tapButton"> Tap Times: {{ times }} </van-button>
    <br />
    <div class="rectangle">
      <div class="rectangle-class"></div>
      <div
        class="rectangle-inline"
        style="width: 100px; height: 50px; background-color: #dcdcdc"
      ></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home {
  width: 100%;
  .button-group {
    display: flex;
    justify-content: center;
    & > button:nth-of-type(2) {
      margin-left: 10px;
    }
  }
  .rectangle {
    width: 200px;
    height: 200px;
    background-color: #00ffff;
    &-class {
      width: 200px;
      height: 100px;
      background-color: #ff9999;
    }
  }
}
</style>
