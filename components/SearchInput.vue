<script setup lang="ts">
const model = defineModel<string>({ default: '' })
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Введите что-то…' })
</script>

<template>
  <div class="relative">
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="w-full rounded-xl border border-border bg-bg px-4 py-3 text-fg outline-none transition-all duration-200 placeholder:text-muted focus:border-[var(--accent-to)] focus:ring-4 focus:ring-[var(--accent-to)]/10"
    />
    <button
      v-if="model"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:text-fg"
      aria-label="Очистить"
      @click="model = ''"
    >
      <Icon name="ph:x-bold" class="h-4 w-4" />
    </button>
  </div>
</template>
