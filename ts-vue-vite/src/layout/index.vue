<script setup lang="ts"></script>

<template>
  <div class="layout">
    <div class="layout-header" />
    <div class="layout-content">
      <router-view />
    </div>
    <div class="layout-bottom" />
  </div>
</template>

<style lang="less" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &-header {
    width: 100%;
    height: 100px;
    background-color: blue;
  }
  &-content {
    width: 100%;
    flex-grow: 1;
    background-color: red;
  }
  &-bottom {
    width: 100%;
    height: 100px;
    background-color: yellow;
  }
}
</style>
