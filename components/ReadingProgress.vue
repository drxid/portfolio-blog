<script setup lang="ts">
const props = defineProps<{ progress: number }>()
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
    <div
      class="h-full origin-left transition-[width] duration-75"
      :style="{
        width: props.progress + '%',
        background: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))',
      }"
    />
  </div>
</template>
