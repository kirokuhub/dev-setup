<script setup lang="ts"></script>

<template>
  <div class="app-wrapper">
    <router-view v-if="!$route.meta.keepAlive" class="router" />
    <router-view
      v-if="$route.meta.keepAlive"
      v-slot="{ Component }"
      class="router"
    >
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="less" scoped></style>
