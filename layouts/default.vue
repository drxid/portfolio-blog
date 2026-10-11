<script setup lang="ts">
// Страница может попросить контейнер шире: definePageMeta({ wide: true })
const route = useRoute()
const width = computed(() => (route.meta.wide ? 'max-w-wider' : ''))
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="container-content" :class="width">
      <AppHeader />
    </div>
    <main class="container-content flex-1 pt-12 sm:pt-16" :class="width">
      <slot />
    </main>
    <div class="container-content" :class="width">
      <AppFooter />
    </div>
  </div>
</template>
