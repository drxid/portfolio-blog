<script setup lang="ts">
defineProps<{ src: string; alt?: string; caption?: string }>()
</script>

<template>
  <figure class="my-6">
    <img :src="src" :alt="alt ?? caption ?? ''" class="w-full rounded-lg border border-border" />
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>
