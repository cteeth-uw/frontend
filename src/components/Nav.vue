<template>
  <nav class="text-left flex ml-[-1rem] text-base lg:py-4 lg:mt-4">
    <RouterLink to="/" class="border-0 router-link-exact-active:hover:bg-transparent">
      Home
    </RouterLink>
    <RouterLink
      to="/about"
      class="border-l-2 border-[var(--color-border)] router-link-exact-active:hover:bg-transparent"
    >
      About
    </RouterLink>
    <RouterLink
      to="/dwv"
      class="border-l-2 border-[var(--color-border)] router-link-exact-active:hover:bg-transparent"
    >
      DWV Test
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style lang="css" scoped>
nav a {
  padding: 0 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}
</style>
