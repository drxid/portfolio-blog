<script setup lang="ts">
const props = defineProps<{
  article: {
    path: string
    title: string
    description: string
    date: string
    tags?: string[]
  }
}>()

const formattedDate = computed(() => formatDate(props.article.date))
</script>

<template>
  <NuxtLink :to="article.path" class="group block">
    <h2 class="text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--accent-to)]">
      {{ article.title }}
    </h2>
    <p class="mt-1.5 max-w-2xl text-[0.97rem] leading-relaxed text-muted">
      {{ article.description }}
    </p>
    <div class="mt-3 flex items-center justify-between gap-4">
      <span class="read-link">
        Читать <span class="arrow">→</span>
      </span>
      <time :datetime="article.date" class="shrink-0 text-sm text-muted">{{ formattedDate }}</time>
    </div>
    <div v-if="article.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
      <span v-for="t in article.tags" :key="t" class="tag">{{ t }}</span>
    </div>
  </NuxtLink>
</template>
