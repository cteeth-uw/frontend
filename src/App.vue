<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import DicomViewer from './components/DicomViewer.vue' // 👈 Add this line
</script>

<template>
  <header class="leading-9 max-h-screen">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper flex items-start flex-wrap">
      <HelloWorld msg="You did it!" />

      <nav class="text-left flex space-x-4">
        <RouterLink
          to="/"
          class="block border-l border-custom-border px-4"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="block border-l border-custom-border px-4"
        >
          About
        </RouterLink>
      </nav>
    </div>
  </header>

  <!-- 👇 DWV Viewer here -->
  <main class="p-4">
    <DicomViewer />
  </main>

  <RouterView />
</template>

<style scoped>
nav a {
  padding: 0 1rem;
  border-left: 2px solid var(--color-border);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
