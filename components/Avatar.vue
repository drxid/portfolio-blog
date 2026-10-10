<script setup lang="ts">
const props = withDefaults(
  defineProps<{ src?: string; alt?: string; initials?: string; size?: number }>(),
  { initials: 'ВБ', size: 128 },
)
const failed = ref(false)
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-border"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt ?? 'Аватар'"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center font-brand text-3xl text-white"
      style="background-image: linear-gradient(135deg, var(--accent-from), var(--accent-to))"
    >
      {{ props.initials }}
    </div>
  </div>
</template>
