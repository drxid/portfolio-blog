<script setup lang="ts">
defineProps<{ text: string }>()
const open = ref(false)
const id = useId()
</script>

<template>
  <span
    class="relative inline-block align-baseline"
    @mouseenter="open = true"
    @mouseleave="open = false"
  >
    <button
      type="button"
      class="cursor-help border-b border-dashed border-muted/70 font-semibold underline-offset-2 transition-colors hover:border-[var(--accent-to)] hover:text-[var(--accent-to)] focus:outline-none focus-visible:text-[var(--accent-to)]"
      :aria-describedby="id"
      @focus="open = true"
      @blur="open = false"
      @click="open = !open"
    >
      <slot />
    </button>

    <Transition name="tip">
      <span
        v-if="open"
        :id="id"
        role="tooltip"
        class="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-lg border border-border bg-bg p-3 text-left text-sm font-normal leading-snug text-fg shadow-lg shadow-black/10"
      >
        {{ text }}
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}
</style>
