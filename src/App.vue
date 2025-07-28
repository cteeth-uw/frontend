<template>
  <header class="leading-9 max-h-screen">
    <div class="wrapper flex items-start flex-wrap">
      <div class="flex flex-col space-y-4">
        <HelloWorld msg="CTeeth" />
        <NavBar />
      </div>
    </div>
  </header>

  <!-- 👇 DWV Viewer here -->
  <!-- <main class="p-4">
    <DicomViewer />
  </main> -->

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/Nav.vue'
// import DicomViewer from './components/DicomViewer.vue' // 👈 Add this line
</script>

<style scoped>
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
