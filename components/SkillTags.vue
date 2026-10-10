<script setup lang="ts">
import { SKILLS } from '~/utils/skills'
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="s in SKILLS"
      :key="s.label"
      class="skill inline-flex items-center gap-1.5 rounded-md border border-border bg-card/40 px-2.5 py-1 text-sm text-fg/80 transition-colors hover:border-fg/30 hover:text-fg"
      :style="{ '--ic': s.color }"
    >
      <Icon :name="s.icon" class="skill-ic h-4 w-4" />
      {{ s.label }}
    </span>
  </div>
</template>

<style scoped>
.skill-ic {
  color: var(--muted);
  transition: color 0.2s ease;
}
.skill:hover .skill-ic {
  color: var(--ic);
}
</style>
