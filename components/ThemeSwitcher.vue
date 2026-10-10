<script setup lang="ts">
const colorMode = useColorMode()

const themes = [
  { value: 'light', label: 'Светлая', icon: 'ph:sun-duotone' },
  { value: 'dark', label: 'Тёмная', icon: 'ph:moon-duotone' },
  { value: 'gruvbox', label: 'Gruvvy', icon: 'ph:palette-duotone' },
] as const

const current = computed(
  () => themes.find((t) => t.value === colorMode.preference) ?? themes[0],
)

function cycle() {
  const idx = themes.findIndex((t) => t.value === colorMode.preference)
  const next = themes[(idx + 1) % themes.length]
  colorMode.preference = next.value
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-fg transition hover:scale-105"
    :title="`Тема: ${current.label} (нажмите, чтобы сменить)`"
    :aria-label="`Сменить тему, текущая: ${current.label}`"
    @click="cycle"
  >
    <ClientOnly>
      <Icon :name="current.icon" class="h-5 w-5" />
      <template #fallback>
        <span class="h-5 w-5" />
      </template>
    </ClientOnly>
  </button>
</template>
