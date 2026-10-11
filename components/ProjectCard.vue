<script setup lang="ts">
import type { Project } from '~/utils/projects'

const props = defineProps<{ project: Project }>()

// Карточка ведёт на сайт проекта, а если его нет — в репозиторий
const href = computed(() => props.project.url ?? props.project.repo)
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex h-full flex-col rounded-2xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--accent-to)] hover:shadow-lg hover:shadow-black/5"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <Icon
          :name="project.icon"
          class="h-6 w-6 text-muted transition-colors group-hover:text-[var(--accent-to)]"
        />
        <h3 class="text-lg font-bold">{{ project.title }}</h3>
      </div>
      <Icon name="ph:arrow-up-right" class="arrow h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </div>
    <p class="mt-3 text-sm leading-relaxed text-muted">{{ project.description }}</p>
    <div class="mt-auto pt-5">
      <div class="flex flex-wrap gap-1.5">
        <span v-for="s in project.stack" :key="s" class="tag">{{ s }}</span>
      </div>
      <p v-if="href" class="mt-4 font-mono text-xs text-fg/70">{{ prettyUrl(href) }}</p>
    </div>
  </a>
</template>
