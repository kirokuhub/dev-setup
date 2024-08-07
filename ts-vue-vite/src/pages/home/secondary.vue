<script setup lang="ts">
import store from "@/store";

const { useCounterStore } = store;
const counterStore = useCounterStore();
function handleCount(newVal: number = 0) {
  counterStore.modifyCount(counterStore.count + newVal);
}
</script>

<template>
  <div class="secondary">
    <p>counter: {{ counterStore.count }}</p>
    <div class="button-group">
      <button @click="handleCount(1)">Add</button>
      <button @click="handleCount(-1)">Minus</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.secondary {
  width: 100%;
  .button-group {
    display: flex;
    justify-content: center;
    & > button:nth-of-type(2) {
      margin-left: 10px;
    }
  }
}
</style>
