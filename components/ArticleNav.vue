<script setup lang="ts">
interface NavItem {
  path: string
  title: string
}
defineProps<{ prev?: NavItem | null; next?: NavItem | null }>()
</script>

<template>
  <nav class="divider-dashed mt-14 grid gap-3 border-x-0 border-b-0 pt-8 sm:grid-cols-2">
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="group flex flex-col gap-1 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-to)] hover:shadow-lg hover:shadow-black/5"
    >
      <span class="flex items-center gap-1 text-xs text-muted">
        <Icon name="ph:arrow-left" class="transition-transform duration-200 group-hover:-translate-x-0.5" />
        Предыдущая статья
      </span>
      <span class="font-semibold transition-colors group-hover:text-[var(--accent-to)]">{{
        prev.title
      }}</span>
    </NuxtLink>
    <div v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="group flex flex-col items-end gap-1 rounded-2xl border border-border p-4 text-right transition-all hover:-translate-y-0.5 hover:border-[var(--accent-to)] hover:shadow-lg hover:shadow-black/5"
    >
      <span class="flex items-center gap-1 text-xs text-muted">
        Следующая статья
        <Icon name="ph:arrow-right" class="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
      <span class="font-semibold transition-colors group-hover:text-[var(--accent-to)]">{{
        next.title
      }}</span>
    </NuxtLink>
    <div v-else class="hidden sm:block" />
  </nav>
</template>
