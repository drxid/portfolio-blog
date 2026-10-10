<script setup lang="ts">
import type { ThemeName } from '~/composables/useThemeSwitch'

const { colorMode, set } = useThemeSwitch()

const order: { value: ThemeName; icon: string; label: string }[] = [
  { value: 'light', icon: 'ph:sun-duotone', label: 'Светлая' },
  { value: 'dark', icon: 'ph:moon-stars-duotone', label: 'Тёмная' },
  { value: 'gruvbox', icon: 'ph:palette-duotone', label: 'Gruvvy' },
]

const current = computed(
  () => order.find((t) => t.value === colorMode.preference) ?? order[0],
)

function cycle() {
  const idx = order.findIndex((t) => t.value === colorMode.preference)
  set(order[(idx + 1) % order.length].value)
}
</script>

<template>
  <button
    type="button"
    class="btn-dashed"
    :aria-label="`Сменить тему (сейчас: ${current.label})`"
    :title="`Тема: ${current.label}`"
    @click="cycle"
  >
    <ClientOnly>
      <Transition name="spin" mode="out-in">
        <Icon :key="current.icon" :name="current.icon" class="h-5 w-5" />
      </Transition>
      <template #fallback><span class="h-5 w-5" /></template>
    </ClientOnly>
  </button>
</template>

<style scoped>
.spin-enter-active,
.spin-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
}
.spin-enter-from {
  transform: rotate(-90deg) scale(0.6);
  opacity: 0;
}
.spin-leave-to {
  transform: rotate(90deg) scale(0.6);
  opacity: 0;
}
</style>
