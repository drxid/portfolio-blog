<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 pb-12">
    <hr class="divider-dashed mb-6" />
    <div class="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p class="font-brand text-fg">drxid</p>
      <p>JS-разработчик · © {{ year }}</p>
      <NuxtLink to="/privacy" class="transition-colors hover:text-fg">
        Политика конфиденциальности
      </NuxtLink>
    </div>
  </footer>
</template>
