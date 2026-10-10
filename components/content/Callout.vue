<script setup lang="ts">
withDefaults(
  defineProps<{ type?: 'info' | 'tip' | 'warning' | 'note' }>(),
  { type: 'info' },
)

const meta = {
  info: { icon: 'ph:info-duotone', label: 'Инфо' },
  tip: { icon: 'ph:lightbulb-duotone', label: 'Совет' },
  warning: { icon: 'ph:warning-duotone', label: 'Внимание' },
  note: { icon: 'ph:note-pencil-duotone', label: 'Заметка' },
} as const
</script>

<template>
  <div class="my-6 flex gap-3 rounded-lg border border-border bg-card p-4">
    <Icon :name="meta[type].icon" class="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-from)]" />
    <div class="min-w-0 text-[0.97rem] leading-relaxed text-fg/90">
      <slot />
    </div>
  </div>
</template>
